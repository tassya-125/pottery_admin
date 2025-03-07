// src/utils/dateUtils.js
export function formatDate(time) {
    if (!time) return '暂无时间';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 确保两位数
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
