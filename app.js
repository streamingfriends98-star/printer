const video=document.querySelector('#camera');
const liveLabel=document.querySelector('#live-label');
const help=document.querySelector('#permission-help');
const switchButton=document.querySelector('#switch-camera');
const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.dot')];
const currentNumber=document.querySelector('#current-number');
let index=0,stream=null,usingFront=false,startX=null;
function showSlide(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===index));dots.forEach((d,i)=>d.classList.toggle('active',i===index));currentNumber.textContent=String(index+1).padStart(2,'0');}
document.querySelector('#prev').addEventListener('click',()=>showSlide(index-1));
document.querySelector('#next').addEventListener('click',()=>showSlide(index+1));
dots.forEach(d=>d.addEventListener('click',()=>showSlide(Number(d.dataset.to))));
document.querySelector('#carousel').addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX},{passive:true});
document.querySelector('#carousel').addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>55)showSlide(index+(dx<0?1:-1));startX=null;},{passive:true});
async function openCamera(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){help.hidden=false;liveLabel.textContent='CAMERA UNAVAILABLE';return;}
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:usingFront?'user':{ideal:'environment'},width:{ideal:1280},height:{ideal:1920}}});
    video.srcObject=stream;await video.play();help.hidden=true;liveLabel.textContent='LIVE CAMERA';switchButton.hidden=false;
  }catch(err){
    console.warn(err);liveLabel.textContent='CAMERA PERMISSION NEEDED';help.hidden=false;
  }
}
switchButton.addEventListener('click',async()=>{usingFront=!usingFront;if(stream)stream.getTracks().forEach(t=>t.stop());await openCamera();});
showSlide(0);
// Attempt to start the camera immediately when the QR page loads.
// The browser may still show a permission prompt or require a secure HTTPS origin.
window.addEventListener('load',openCamera);
window.addEventListener('pagehide',()=>{if(stream)stream.getTracks().forEach(t=>t.stop());});