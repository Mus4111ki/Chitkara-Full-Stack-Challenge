function isValidEdge(edge) {
edge = edge.trim();

const regex = /^[A-Z]->[A-Z]$/;

if (!regex.test(edge)) return false;

const [parent, child] = edge.split("->");

return parent !== child;
}

function buildTree(node, graph) {
const obj = {};

for (const child of graph[node] || []) {
obj[child] = buildTree(child, graph);
}

return obj;
}

function getDepth(node, graph) {
const children = graph[node] || [];

if (children.length === 0) return 1;

let maxDepth = 0;

for (const child of children) {
maxDepth = Math.max(maxDepth, getDepth(child, graph));
}

return maxDepth + 1;
}

function hasCycle(start, graph) {
const visited = new Set();
const recStack = new Set();

function dfs(node) {
if (recStack.has(node)) return true;
if (visited.has(node)) return false;


visited.add(node);
recStack.add(node);

for (const child of graph[node] || []) {
  if (dfs(child)) return true;
}

recStack.delete(node);
return false;


}

return dfs(start);
}

function processHierarchy(data) {
const invalidEntries = [];
const duplicateEdges = [];

const seenEdges = new Set();
const duplicateTracker = new Set();
const validEdges = [];

// Validation + Duplicate Detection
for (let edge of data) {
edge = edge.trim();


if (!isValidEdge(edge)) {
  invalidEntries.push(edge);
  continue;
}

if (seenEdges.has(edge)) {
  if (!duplicateTracker.has(edge)) {
    duplicateEdges.push(edge);
    duplicateTracker.add(edge);
  }
  continue;
}

seenEdges.add(edge);
validEdges.push(edge);


}

// Graph + Multi Parent Rule
const graph = {};
const childParentMap = new Map();

for (const edge of validEdges) {
const [parent, child] = edge.split("->");


if (childParentMap.has(child)) continue;

childParentMap.set(child, parent);

if (!graph[parent]) graph[parent] = [];
graph[parent].push(child);

if (!graph[child]) graph[child] = [];


}

const allNodes = new Set();

for (const node in graph) {
allNodes.add(node);


for (const child of graph[node]) {
  allNodes.add(child);
}


}

const childNodes = new Set(childParentMap.keys());

let roots = [];

for (const node of allNodes) {
if (!childNodes.has(node)) {
roots.push(node);
}
}

roots.sort();

// Pure cycle case
if (roots.length === 0 && allNodes.size > 0) {
roots = [[...allNodes].sort()[0]];
}

const hierarchies = [];

let largestDepth = 0;
let largestRoot = "";

let totalTrees = 0;
let totalCycles = 0;

for (const root of roots) {
const cycle = hasCycle(root, graph);


if (cycle) {
  hierarchies.push({
    root,
    tree: {},
    has_cycle: true
  });

  totalCycles++;
  continue;
}

const treeData = {};
treeData[root] = buildTree(root, graph);

const depth = getDepth(root, graph);

hierarchies.push({
  root,
  tree: treeData,
  depth
});

totalTrees++;

if (
  depth > largestDepth ||
  (depth === largestDepth &&
    (largestRoot === "" || root < largestRoot))
) {
  largestDepth = depth;
  largestRoot = root;
}


}

return {
hierarchies,
invalid_entries: invalidEntries,
duplicate_edges: duplicateEdges,
summary: {
total_trees: totalTrees,
total_cycles: totalCycles,
largest_tree_root: largestRoot
}
};
}

module.exports = { processHierarchy };
