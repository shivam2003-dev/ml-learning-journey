import type { Project } from "./projects";

export type GuideChapter = {
  title: string;
  goal: string;
  explanation: string;
  analogy: string;
  checklist: string[];
  code: string;
  hint: string;
};

export type ProjectGuide = {
  language: string;
  filename: string;
  setup: string;
  chapters: GuideChapter[];
  fullCode: string;
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

const randomForestCode = `import numpy as np
from collections import Counter

class Node:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature, self.threshold = feature, threshold
        self.left, self.right, self.value = left, right, value
    def is_leaf(self): return self.value is not None

class DecisionTree:
    def __init__(self, max_depth=8, min_samples_split=2, max_features=None):
        self.max_depth, self.min_samples_split = max_depth, min_samples_split
        self.max_features, self.root = max_features, None

    @staticmethod
    def _gini(y):
        if len(y) == 0: return 0.0
        counts = np.bincount(y)
        probabilities = counts[counts > 0] / len(y)
        return 1.0 - np.sum(probabilities ** 2)

    def _gain(self, y, left, right):
        if len(left) == 0 or len(right) == 0: return 0.0
        n = len(y)
        child_impurity = len(left)/n*self._gini(y[left]) + len(right)/n*self._gini(y[right])
        return self._gini(y) - child_impurity

    def _best_split(self, X, y, features):
        best_gain, best = -1.0, (None, None)
        for feature in features:
            for threshold in np.unique(X[:, feature]):
                left = np.flatnonzero(X[:, feature] <= threshold)
                right = np.flatnonzero(X[:, feature] > threshold)
                gain = self._gain(y, left, right)
                if gain > best_gain: best_gain, best = gain, (feature, threshold)
        return best

    def _grow(self, X, y, depth=0):
        if depth >= self.max_depth or len(y) < self.min_samples_split or len(np.unique(y)) == 1:
            return Node(value=Counter(y).most_common(1)[0][0])
        count = self.max_features or max(1, int(np.sqrt(X.shape[1])))
        features = np.random.choice(X.shape[1], min(count, X.shape[1]), replace=False)
        feature, threshold = self._best_split(X, y, features)
        if feature is None: return Node(value=Counter(y).most_common(1)[0][0])
        mask = X[:, feature] <= threshold
        return Node(feature, threshold, self._grow(X[mask], y[mask], depth+1), self._grow(X[~mask], y[~mask], depth+1))

    def fit(self, X, y): self.root = self._grow(np.asarray(X), np.asarray(y)); return self
    def _predict_one(self, row, node):
        if node.is_leaf(): return node.value
        child = node.left if row[node.feature] <= node.threshold else node.right
        return self._predict_one(row, child)
    def predict(self, X): return np.array([self._predict_one(row, self.root) for row in X])

class RandomForest:
    def __init__(self, n_trees=25, max_depth=8, max_features=None, seed=42):
        self.n_trees, self.max_depth, self.max_features = n_trees, max_depth, max_features
        self.rng, self.trees = np.random.default_rng(seed), []
    def fit(self, X, y):
        X, y = np.asarray(X), np.asarray(y, dtype=int)
        self.trees = []
        for _ in range(self.n_trees):
            rows = self.rng.integers(0, len(X), len(X))
            tree = DecisionTree(self.max_depth, max_features=self.max_features).fit(X[rows], y[rows])
            self.trees.append(tree)
        return self
    def predict(self, X):
        votes = np.stack([tree.predict(X) for tree in self.trees])
        return np.array([Counter(column).most_common(1)[0][0] for column in votes.T])

if __name__ == "__main__":
    X = np.array([[0,0],[0,1],[1,0],[1,1],[2,1],[2,2]])
    y = np.array([0,0,0,1,1,1])
    model = RandomForest(n_trees=31, max_depth=4).fit(X, y)
    print("predictions:", model.predict(X))
    print("accuracy:", np.mean(model.predict(X) == y))`;

const svmCode = `import numpy as np

class LinearSVM:
    def __init__(self, learning_rate=0.001, regularization=0.01, epochs=2000):
        self.lr, self.reg, self.epochs = learning_rate, regularization, epochs
    def fit(self, X, y):
        X, y = np.asarray(X, float), np.where(np.asarray(y) <= 0, -1.0, 1.0)
        self.w, self.b = np.zeros(X.shape[1]), 0.0
        for _ in range(self.epochs):
            margins = y * (X @ self.w + self.b)
            active = margins < 1
            grad_w = 2 * self.reg * self.w - (X[active].T @ y[active]) / len(X)
            grad_b = -np.sum(y[active]) / len(X)
            self.w -= self.lr * grad_w
            self.b -= self.lr * grad_b
        return self
    def decision_function(self, X): return np.asarray(X) @ self.w + self.b
    def predict(self, X): return (self.decision_function(X) >= 0).astype(int)

if __name__ == "__main__":
    X = np.array([[0,0],[1,1],[1,0],[4,4],[5,5],[5,4]], float)
    y = np.array([0,0,0,1,1,1])
    model = LinearSVM(learning_rate=.01, epochs=3000).fit(X, y)
    print(model.predict(X), "accuracy:", np.mean(model.predict(X) == y))`;

const qLearningCode = `import numpy as np
import gymnasium as gym

def train(episodes=10_000, alpha=.8, gamma=.95, epsilon=1.0):
    env = gym.make("FrozenLake-v1", is_slippery=True)
    q = np.zeros((env.observation_space.n, env.action_space.n))
    rng = np.random.default_rng(7)
    for episode in range(episodes):
        state, _ = env.reset(seed=episode)
        done = False
        while not done:
            action = env.action_space.sample() if rng.random() < epsilon else int(np.argmax(q[state]))
            next_state, reward, terminated, truncated, _ = env.step(action)
            target = reward + gamma * np.max(q[next_state]) * (not terminated)
            q[state, action] += alpha * (target - q[state, action])
            state, done = next_state, terminated or truncated
        epsilon = max(.01, epsilon * .9995)
    env.close()
    return q

def evaluate(q, games=1000):
    env = gym.make("FrozenLake-v1", is_slippery=True)
    wins = 0
    for seed in range(games):
        state, _ = env.reset(seed=seed); done = False
        while not done:
            state, reward, terminated, truncated, _ = env.step(int(np.argmax(q[state])))
            done = terminated or truncated
        wins += reward
    env.close(); return wins / games

if __name__ == "__main__":
    table = train()
    print(table)
    print("win rate:", evaluate(table))`;

const genericCode = (project: Project) => `"""${project.title}
Educational implementation blueprint.
Run each TODO in order, then compare your output with the checks below.
"""

from dataclasses import dataclass
import numpy as np

@dataclass
class Config:
    seed: int = 42
    learning_rate: float = 1e-3
    epochs: int = 100

def prepare_data(seed=42):
    """Return a tiny deterministic dataset so every run is reproducible."""
    rng = np.random.default_rng(seed)
    X = rng.normal(size=(128, 8)).astype(np.float32)
    y = (X[:, 0] + .5 * X[:, 1] > 0).astype(np.int64)
    return X, y

class ${project.title.replace(/[^a-zA-Z0-9]/g, "")}:
    """Small reference system for: ${project.concepts.join(", ")}."""
    def __init__(self, config=Config()):
        self.config = config
        self.state = {}
    def fit(self, X, y):
        # Replace this baseline with the chapter implementations below.
        self.state["class_prior"] = np.bincount(y) / len(y)
        self.state["centers"] = np.stack([X[y == label].mean(0) for label in np.unique(y)])
        return self
    def predict(self, X):
        distances = ((X[:, None, :] - self.state["centers"][None, :, :]) ** 2).sum(-1)
        return distances.argmin(1)

def main():
    X, y = prepare_data()
    model = ${project.title.replace(/[^a-zA-Z0-9]/g, "")}().fit(X, y)
    predictions = model.predict(X)
    print("shape:", predictions.shape)
    print("baseline accuracy:", float(np.mean(predictions == y)))
    assert predictions.shape == y.shape

if __name__ == "__main__":
    main()`;

function fullCode(project: Project) {
  if (project.slug === "random-forest-from-scratch") return randomForestCode;
  if (project.slug === "support-vector-machine-from-scratch") return svmCode;
  if (project.slug === "q-learning-on-frozenlake-from-scratch") return qLearningCode;
  return genericCode(project);
}

export function getProjectGuide(project: Project): ProjectGuide {
  const code = fullCode(project);
  const concepts = project.concepts;
  const chunks = code.split("\n");
  const chapterSize = Math.ceil(chunks.length / concepts.length);
  const chapters = concepts.map((concept, index) => ({
    title: `${index + 1}. Build ${concept}`,
    goal: `Understand ${concept} and add it to the working ${project.title} implementation.`,
    explanation: `${concept} is one small job inside the larger system. First we make that job work with tiny, predictable data. Then we connect it to the next part. This keeps bugs small and makes the mathematics easier to see.`,
    analogy: `Think of ${concept} like one station on an assembly line: it receives something simple, performs one clear transformation, and passes a checked result forward.`,
    checklist: [
      `Read the input and output shapes for ${concept}`,
      `Implement the smallest correct version`,
      `Test it with a tiny example before connecting it`,
    ],
    code: chunks.slice(index * chapterSize, Math.min(chunks.length, (index + 1) * chapterSize)).join("\n"),
    hint: `Print intermediate shapes and two or three values. If those are correct, the larger ${concept} step is usually correct too.`,
  }));
  return {
    language: project.framework.includes("CUDA") ? "cuda" : "python",
    filename: project.framework.includes("CUDA") ? "solution.cu" : "solution.py",
    setup: project.libraries.length ? `Install: ${project.libraries.join(", ")}` : "No extra libraries required.",
    chapters,
    fullCode: code,
    quiz: {
      question: `What is the safest way to build ${project.title}?`,
      options: ["Write everything, then run it once", `Build and test ${concepts[0]} first`, "Skip small-data tests", "Tune performance before correctness"],
      answer: 1,
      explanation: `Building and testing ${concepts[0]} first gives you a trusted foundation. Small verified pieces are much easier to debug.`,
    },
  };
}
