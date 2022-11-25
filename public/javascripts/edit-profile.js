$(document).ready(function () {
        var readURL = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.profile-pic').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }


        $(".file-upload").on('change', function () {
            readURL(this);
        });

        $(".upload-button").on('click', function () {
            $(".file-upload").click();
        });
    });



    function validateName() {
        const messg = document.getElementById("Name")
        const con = document.getElementById("Name").value
        if (con == "") {
            messg.innerHTML = "| Fill The Fields"
            return false;
        }
        if (!con.match(/^[a-zA-Z-" "]*$/)) {
            messg.innerHTML = "| Only Alphabets Are Allowed"
            return false;
        }
        messg.innerHTML = ""
        return true;
    }

    function validateLastName() {
        const messg = document.getElementById("lastNameErr")
        const con = document.getElementById("lastName").value
        if (con == "") {
            messg.innerHTML = "| Fill The Fields"
            return false;
        }
        if (!con.match(/^[a-zA-Z-" "]*$/)) {
            messg.innerHTML = "| Only Alphabets Are Allowed"
            return false;
        }
        messg.innerHTML = ""
        return true;
    }

    function validatePhoneNumber() {
        const messg = document.getElementById("moberr")
        const name = document.getElementById('phoneNumber').value
        if (name == "" || name == null) {
            messg.innerHTML = "Enter a mobile number"
            return false
        } else if
            (name.length < 10 || name.length > 10) {
            messg.innerHTML = "Enter a Valid Mobile number"
            return false
        }

        messg.innerHTML = null
        return true
    }
    function validateEmail() {
        const messg = document.getElementById("emailerr")
        const name = document.getElementById('email').value
        if (name == "") {
            messg.innerHTML = "Enter you email address"
            return false


        } else if
            (!name.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
            messg.innerHTML = 'Enter a proper email adress'
            return false
        }

        messg.innerHTML = null
        return true
    }

    function validation() {
        if (!validateName()) {
            return false;
        }
        return true;
    }
