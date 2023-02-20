
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});

const inputs = document.querySelectorAll(".input");


function focusFunc(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function blurFunc(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", focusFunc);
	input.addEventListener("blur", blurFunc);
});


  