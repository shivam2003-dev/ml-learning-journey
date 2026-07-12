"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { AlertCircle, CheckCircle2, ExternalLink, GitFork, Github, Star } from "lucide-react";

type Repo = { full_name:string; html_url:string; description:string|null; stargazers_count:number; forks_count:number; open_issues_count:number; language:string|null; license:{spdx_id:string}|null; default_branch:string; pushed_at:string };
type Commit = { sha:string; commit:{message:string;author:{date:string}}; html_url:string };
type Contributor = { login:string; avatar_url:string; html_url:string; contributions:number };
type Release = { tag_name:string; html_url:string; published_at:string };
type Run = { conclusion:string|null; status:string; html_url:string; name:string };
type Deployment = { created_at:string; environment:string; statuses_url:string };

function normalize(value:string){const match=value.trim().match(/(?:github\.com\/)?([^/\s]+)\/([^/#\s]+?)(?:\.git)?$/);return match?`${match[1]}/${match[2]}`:""}

export function GitHubPanel({repositories}:{repositories:Record<string,string>}) {
  const repoName = Object.values(repositories).map(normalize).find(Boolean) ?? "";
  const query = useQuery({queryKey:["github-repo",repoName],enabled:!!repoName,queryFn:async()=>{
    const api=`https://api.github.com/repos/${repoName}`;
    const [repoRes,commitRes,languagesRes,contributorsRes,releaseRes,runsRes,deploymentsRes,readmeRes]=await Promise.all([fetch(api),fetch(`${api}/commits?per_page=30`),fetch(`${api}/languages`),fetch(`${api}/contributors?per_page=5`),fetch(`${api}/releases/latest`),fetch(`${api}/actions/runs?per_page=1`),fetch(`${api}/deployments?per_page=1`),fetch(`${api}/readme`)]);
    if(!repoRes.ok)throw new Error(repoRes.status===404?"Repository not found":"GitHub API unavailable");
    const repo=await repoRes.json() as Repo;
    const commits=commitRes.ok?await commitRes.json() as Commit[]:[];
    const languages=languagesRes.ok?await languagesRes.json() as Record<string,number>:{};
    const contributors=contributorsRes.ok?await contributorsRes.json() as Contributor[]:[];
    const release=releaseRes.ok?await releaseRes.json() as Release:null;
    const runs=runsRes.ok?(await runsRes.json() as {workflow_runs:Run[]}).workflow_runs:[];
    const deployments=deploymentsRes.ok?await deploymentsRes.json() as Deployment[]:[];
    const readme=readmeRes.ok?await readmeRes.json() as {html_url:string}:null;
    return{repo,commit:commits[0],commits,languages,contributors,release,run:runs[0],deployment:deployments[0],readme};
  }});

  if(!repoName)return <article className="dash-card integration wide"><Github/><div><small>GITHUB INTEGRATION</small><h2>Connect your build trail</h2><p>Add an <strong>owner/repository</strong> on any project page. This dashboard will then fetch its live repository, latest commit, language, license, stars, forks, issues, and activity from GitHub.</p></div></article>;
  if(query.isLoading)return <article className="dash-card integration wide"><Github/><div><small>GITHUB INTEGRATION</small><h2>Loading {repoName}…</h2></div></article>;
  if(query.isError)return <article className="dash-card integration wide"><AlertCircle/><div><small>GITHUB INTEGRATION</small><h2>Could not load {repoName}</h2><p>{query.error.message}. Check the repository entered on the project page or GitHub&apos;s public API rate limit.</p></div></article>;
  const {repo,commit,commits,languages,contributors,release,run,deployment,readme}=query.data!;
  const totalLanguageBytes=Object.values(languages).reduce((a,b)=>a+b,0);
  return <article className="dash-card github-live wide"><div className="card-heading"><div><small>LIVE GITHUB PROJECT</small><h2><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.full_name} <ExternalLink/></a></h2></div><CheckCircle2/></div><p>{repo.description??"No repository description provided."}</p>
    <div className="repo-metrics"><span><Star/>{repo.stargazers_count} stars</span><span><GitFork/>{repo.forks_count} forks</span><span>{repo.open_issues_count} issues</span><span>{repo.license?.spdx_id??"No license"}</span>{release&&<a href={release.html_url} target="_blank" rel="noreferrer">Release {release.tag_name}</a>}{readme&&<a href={readme.html_url} target="_blank" rel="noreferrer">README</a>}<span>CI: {run?.conclusion??run?.status??"not reported"}</span><span>Deployment: {deployment?new Date(deployment.created_at).toLocaleDateString():"not reported"}</span></div>
    {totalLanguageBytes>0&&<div className="language-bar">{Object.entries(languages).map(([name,bytes],i)=><i title={`${name} ${Math.round(bytes/totalLanguageBytes*100)}%`} key={name} style={{width:`${bytes/totalLanguageBytes*100}%`,background:["#8c70ff","#55a7ff","#54d1a1","#f0bf59","#ef7cae"][i%5]}}/>)}</div>}
    <div className="github-split"><div>{commit&&<a className="latest-commit" href={commit.html_url} target="_blank" rel="noreferrer"><code>{commit.sha.slice(0,7)}</code><span><strong>{commit.commit.message.split("\n")[0]}</strong><small>{new Date(commit.commit.author.date).toLocaleString()}</small></span><ExternalLink/></a>}<div className="commit-graph" aria-label="Recent commit graph">{commits.slice().reverse().map((item,i)=><i key={item.sha} title={new Date(item.commit.author.date).toLocaleDateString()} data-level={(i%4)+1}/>)}</div></div><div className="contributors"><small>CONTRIBUTORS</small>{contributors.map(person=><a href={person.html_url} target="_blank" rel="noreferrer" key={person.login}><Image src={person.avatar_url} width={22} height={22} alt=""/><span>{person.login}<b>{person.contributions} commits</b></span></a>)}</div></div>
    <small>Default branch: {repo.default_branch} · Last push: {new Date(repo.pushed_at).toLocaleDateString()} · Languages: {Object.keys(languages).join(", ")||repo.language||"not reported"}</small></article>;
}
