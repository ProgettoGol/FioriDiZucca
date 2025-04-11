// XmlHttpRequest.addCommonHead()

urlList = ['/src/menu/html/menu.html', '/src/contatti/html/contatti.html', 'src/footer/html/footer.html']

urlList.forEach(url => {
    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function() {
        if(xmlHttpRequest.readyState === XMLHttpRequest.DONE && xmlHttpRequest.status === 200) {
            document.body.innerHTML += xmlHttpRequest.responseText;
        }
    }
    
    xmlHttpRequest.open("GET", url, true)
    xmlHttpRequest.send();
})