const url='js/practice.pdf';

let pdfDoc=null,
pageNum=1,
pageIsRendering=false,
pageNumIsPending=null;
const scale=1;
canvas=document.querySelector('#pdf-render')
ctx=canvas.getContext('2d');
const renderPage=num=>{
    pageIsRendering=true;
    pdfDoc.getPage(num).then(page=>{
        const viewport=page.getViewport({scale});
        canvas.height=viewport.height;
        canvas.width=viewport.width;
        const renderctx={
            canvasContext: ctx,
            viewport
        }
        page.render(renderctx).promise.then(()=>{
            pageIsRendering=false;
            if(pageNumIsPending!==NULL){
                renderPage(pageNumIsPending);
                pageNumIsPending=null;
            }
        });
        document.querySelector('#page-num').textContent=num;
    });
};
const queueRenderPage=num=>{
    if(pageIsRendering){
        pageIsRendering=num;
    }
    else{
        renderPage(num);
    }
}
const showPrevPage=()=>{
    if(pageNum<=1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}
const showNextPage=()=>{
    if(pageNum>=pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}
pdfjsLib.getDocument(url).promise.then(pdfDoc_=>{
pdfDoc=pdfDoc_;
document.querySelector('#page-count').textContent=pdfDoc.numPages;
renderPage(pageNum);
});
function downloadFile(url, fileName){
    fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
      .then(res => res.blob())
      .then(res => {
        const aElement = document.createElement('a');
        aElement.setAttribute('download', fileName);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        // aElement.setAttribute('href', href);
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
      });
  };
  // dashboard.js
function deleteFile(){
    document.querySelector('#document-viewer').innerHTML="";
}
/*function isAdminUser(){
    const userRole = '<%= req.session.user ? req.session.user.role : "" %>';
    return userRole;
}

console.log(isAdminUser);*/
document.querySelector('#previousButton').addEventListener('click', showPrevPage);
document.querySelector('#nextButton').addEventListener('click', showNextPage);
 document.querySelector('#downloadButton').onclick =function () {
    downloadFile(url, 'DownloadFile');
 }
document.querySelector('#delete').addEventListener('click', deleteFile);