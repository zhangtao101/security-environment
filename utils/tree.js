/**
 * 递归展平树结构为一维数组
 * @param {Array} nodes - 树节点数组
 * @param {string} childrenKey - 子节点数组的键名
 * @returns {Array} - 展平后的一维数组
 */
export function flattenTree(nodes, childrenKey = 'children') {
  const result = [];
  
  // 辅助递归函数
  function processNode(node) {
    // 创建不含子节点的新对象
    const { [childrenKey]: _, ...flatNode } = node;
    result.push(flatNode);
    
    // 递归处理子节点
    if (node[childrenKey] && Array.isArray(node[childrenKey])) {
      node[childrenKey].forEach(processNode);
    }
  }
  
  // 处理所有根节点
  if (Array.isArray(nodes)) {
    nodes.forEach(processNode);
  } else if (nodes) {
    processNode(nodes);
  }
  
  return result;
}