var burgBut = document.querySelector("#burgBut");
var burgMenu = document.querySelector("#burgMenu");
	
	//functions

function burgbut() {
		burgMenu.classList.toggle("slideToggle");
		console.log('clicked');
}


function reader(buttons) {
  var expandBut = document.getElementById("expanded");
  expandBut.src = buttons.src;
  expandBut.parentElement.style.display = "block";
}
	
	//listeners

burgBut.addEventListener("click", burgbut, false);