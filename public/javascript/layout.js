/**
 * Created by: Fernando Garcia
 * User: userxifi
 * Date: 6/5/13
 * Time: 3:43 AM
 */
window.onresize = function(event) {
    myWidth = window.innerWidth;

    if (myWidth < 784
        ){
        document.getElementById('kk').style.width = '100%';
        document.getElementById('register').style.display = 'inline';
        document.body.style.minWidth = '375px';
    }
    else{
        document.getElementById('kk').style.width = '80%';
        document.getElementById('register').style.display = 'none';
        document.body.style.minWidth = '900px';
    }
};

window.onload = function(event) {
    var highestCol = $('.span12').height();
    $('.blocks').height(highestCol);
};

var confirmSubmit = function(msg,form_name) {

    bootbox.confirm(msg, 'Cancel', 'Delete', function(result) {
        if (result) {
            document.all[form_name].submit();
        }
    });

    return false;
};

