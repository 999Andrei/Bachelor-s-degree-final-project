
// switching for login and register
document.getElementById("register_frm").addEventListener("click", function () {
    document.getElementById("login-name").setAttribute("disabled", "");
    document.getElementById("login-password").setAttribute("disabled", "");
    document.getElementById("login_form").style.display = "none";
    document.getElementById("register_form").style.display = "block";
    document.getElementById("register-name").removeAttribute("disabled");
    document.getElementById("register-password").removeAttribute("disabled");
    document.getElementById("register-confirm-password").removeAttribute("disabled");
    document.getElementById("register-employer-code").removeAttribute("disabled");
});

document.getElementById("login_frm").addEventListener("click", function () {
    document.getElementById("login_form").style.display = 'block';
    document.getElementById("login-name").removeAttribute("disabled");
    document.getElementById("login-password").removeAttribute("disabled");
    document.getElementById("register-name").setAttribute("disabled", "");
    document.getElementById("register-password").setAttribute("disabled", "");
    document.getElementById("register-confirm-password").setAttribute("disabled", "");
    document.getElementById("register-employer-code").setAttribute("disabled", "");
    document.getElementById("register_form").style.display = 'none';

});
// button functions upload image
var btnUpload = $("#upload_file"),
		btnOuter = $(".button_outer");
	btnUpload.on("change", function(e){
		var ext = btnUpload.val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$(".error_msg").text("Not an Image...");
		} else {
			$(".error_msg").text("");
			btnOuter.addClass("file_uploading");
			setTimeout(function(){
				btnOuter.addClass("file_uploaded");
			},3000);
            // console.log(btnUpload);
            // console.log(e.target.files[0].name);
			var uploadedFile = URL.createObjectURL(e.target.files[0]);
            var filename = document.getElementById("filename");
            filename.value = "../images/doctors/" + e.target.files[0].name;
            // console.log("../" + filename.value);
			setTimeout(function(){
				$("#uploaded_view").append('<img src="'+uploadedFile+'" />').addClass("show");
			},3500);
		}
	});
	$(".file_remove").on("click", function(e){
		$("#uploaded_view").removeClass("show");
		$("#uploaded_view").find("img").remove();
		btnOuter.removeClass("file_uploading");
		btnOuter.removeClass("file_uploaded");
	});

// textarea script
$.fn.extend({
    autoHeight: function () {
      
      function autoHeight_(element) {
        return $(element)
          .css( { 'height': 'fit-content', 'overflow': 'hidden' } )
          .height(element.scrollHeight);
      }
      
      return this.each( function() {
        autoHeight_(this).on('input', function() {
          autoHeight_(this);
        });
      });
    }
  });
  
  $('textarea').autoHeight();


