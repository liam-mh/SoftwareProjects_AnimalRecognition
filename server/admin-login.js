function validate(event)
{
  event.preventDefault();
var username=document.getElementById("username").value;
var password=document.getElementById("password").value;
if(username=="admin" && password=="user")
{
  window.location.href = "/admin";
}
else
{
  alert("login failed");
}


}

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});



