//设计稿宽度
const layoutWidth = 750;
// 基准大小，设置为设计稿的十分之一，10rem即等于页面宽度
const baseSize = layoutWidth / 10;
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于设计稿宽度的缩放比例
  const scale = document.documentElement.clientWidth / layoutWidth;
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + "px";
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem();
};
