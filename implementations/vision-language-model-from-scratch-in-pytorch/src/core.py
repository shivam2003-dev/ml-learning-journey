import torch

def contrastive_loss(image, text, temperature=0.1):
    image=torch.nn.functional.normalize(image,dim=-1); text=torch.nn.functional.normalize(text,dim=-1)
    logits=image@text.T/temperature; target=torch.arange(len(image))
    return (torch.nn.functional.cross_entropy(logits,target)+torch.nn.functional.cross_entropy(logits.T,target))/2

def run_demo(seed=0):
    torch.manual_seed(seed); latent=torch.randn(32,6); images=latent@torch.randn(6,10)+.05*torch.randn(32,10); texts=latent@torch.randn(6,8)+.05*torch.randn(32,8)
    vi=torch.nn.Linear(10,6); vt=torch.nn.Linear(8,6); opt=torch.optim.Adam([*vi.parameters(),*vt.parameters()],lr=.03)
    start=float(contrastive_loss(vi(images),vt(texts)).detach())
    for _ in range(100): opt.zero_grad(); loss=contrastive_loss(vi(images),vt(texts)); loss.backward(); opt.step()
    sim=torch.nn.functional.normalize(vi(images),dim=-1)@torch.nn.functional.normalize(vt(texts),dim=-1).T
    recall=float((sim.argmax(1)==torch.arange(32)).float().mean())
    return {"initial_loss":start,"final_loss":float(loss.detach()),"retrieval_recall_at_1":recall}
