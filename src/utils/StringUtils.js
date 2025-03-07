export function getOriginString(vals,regionData) {
    if (!Array.isArray(vals) || vals.length === 0) {
        console.log(vals)
        return vals;
    }

    let resultLabels = [];
    let currentLevel = regionData; // 初始时指向最外层

    for (const val of vals) {
        // 在当前层级查找对应的对象
        const found = currentLevel.find(item => item.value === val);
        if (found) {
            // 找到后将对应的中文 label 存入结果
            resultLabels.push(found.label);
            // 准备进入下一级
            currentLevel = found.children || [];
        } else {
            // 如果找不到则提前结束
            break;
        }
    }
    return  JSON.stringify({"index":vals,"values":resultLabels});
}

export function getOriginIndex(val){
    if(!isValidJSON(val)){
        return []
    }
    return JSON.parse(val)["index"]
}
export function getOriginValue(val){
    if(!isValidJSON(val)){
        return val
    }
    return JSON.parse(val)["values"].join("/")
}
function isValidJSON(str) {
    try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
        return false;
    }
}
