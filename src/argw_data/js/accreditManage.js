$(function(){

    $('.select-file-input').change(function (eve) {
        console.log(eve.target.files);
        if (eve.target.files && eve.target.files.length >= 0) {
            $('.select-name').html(eve.target.files[0].name);
        }
    });

});
