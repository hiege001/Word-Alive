module.exports = function(src, type){
  if(type == 'style'){
    var s = document.createElement( 'link' );
        s.rel  = 'stylesheet';
        s.type = 'text/css';
        s.href = src;
        document.head.appendChild( s );
  }
  else{
    var s = document.createElement( 'script' );
        s.innerHTML = src;
        document.head.appendChild( s );
  }
}