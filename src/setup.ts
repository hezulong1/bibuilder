export default function setupSite() {
  let rootStyle = document.documentElement.style;
  let workbenchStyle = document.querySelector<HTMLElement>('#workbench')!.style;

  function setViewportStyle() {
    let vh = window.innerHeight * 0.01;
    rootStyle.setProperty('--vh', vh + 'px');
    workbenchStyle.setProperty('width', window.innerWidth + 'px');
    workbenchStyle.setProperty('height', 'calc(var(--vh, 1vh) * 100)');
  }

  setViewportStyle();
  window.addEventListener('resize', setViewportStyle);
}
