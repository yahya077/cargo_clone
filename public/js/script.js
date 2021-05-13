var errorMessage = null;
getUserData();
$('#branchInput').keyup(e => {
    var textBox = $(e.target);
    var value = textBox.val().trim();
    
    if(value.length > 3){
        $.get("/branch/key/" + value, results => {
            console.log(results);
            outputBranchesDropDown(results, $("#branch-dropdown"), 'checkDropDown');
            closeActivePopup($("#branch-dropdown"), $('#branchInput'), true);
        });
    }else if(value.length < 4){
        $("#branch-dropdown").fadeOut();
        $("#branch-dropdown").html();
    }
});

$('#fromInput').keyup(e => {
    calculateInputOutput(e, $("#from-dropdown"), $('#fromInput'), 'from');
});

$('#toInput').keyup(e => {
    calculateInputOutput(e, $("#to-dropdown"), $('#toInput'), 'to');
});

$('#calculatePrice').click((e) => {
    calculatePrice(e);
});

$(document).on("click", "#branch-dropdown-btn", (e) => {
    var container = $(e.target);
    var id = container.data().id;

    if(id == undefined || id == "" || id == null){
        outputModal([], $(".process-holder"), 0);
    }else{
        $.get("/branch/" + id, results => {
            $('#checkModal').modal('toggle');
            outputModal(results, $(".process-holder"), 'branch');
        })
    }
})

$(document).on("click", "#from-dropdown-btn", (e) => {
    calculateInputAction(e, $('#fromInput'))
})

$(document).on("click", "#to-dropdown-btn", (e) => {
    calculateInputAction(e, $('#toInput'))
})

$(document).on("click", "#shipment-check-btn", (e) => {
    var code = $("#shipmentCode").val();
        if(code == undefined || code == "" || code == null){
            outputModal([], $(".process-holder"), 0);
        }else{
            $.get("/shipment/" + code, results => {
                console.log(results);
                outputModal(results, $(".process-holder"), 'shipmentCode');
            })
        }
})

function calculateInputOutput(e, container, input, type){
    var textBox = $(e.target);
    var value = textBox.val().trim();
    
    if(value.length > 3){
        $.get("/branch/key/" + value, results => {
            console.log(results);
            outputBranchesDropDown(results, container, type);
            closeActivePopup(container, input, false);
        });
    }else if(value.length < 4){
        container.fadeOut();
        container.html();
    }
}

function calculateInputAction(e, container){
    var target = $(e.target);
    var id = target.attr('data-id');
    if(id == undefined || id == "" || id == null){
        outputModal([], $(".process-holder"), 0);
    }else{
        console.log(id);
        container.attr('data-id',id);
        container.val(target.html());
    }
}

function calculatePrice(e){
    var from = $('#fromInput').attr('data-id');
    var to = $('#toInput').attr('data-id');

    $.get("/branch/" + from + "/" + to + "/calculate", results => {
        if(results.success){
            $('#checkModal').modal('toggle');
            outputModal(results, $(".process-holder"), 'calculate');
        }else{
            console.log(results);
        }
    });
}

function outputModal(results, container, type) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }
    results.forEach(result => {
        console.log(type);
        var html = createHtml(result, type);
        container.append(html);
    });

    if (results.length == 0) {
        $('#checkModalLabel').html('Hata!');
        container.append("<span class='noResults'>Sonuç Bulunamadı.</span>")
    }
}

function outputBranchesDropDown(results, container, type) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createHtml(result, (type == 'checkDropDown') ? 'checkDropDown' : (type == 'from') ? 'fromDropDown' : (type == 'to') ? 'toDropDown' : '')
        console.log((type == 'checkDropDown') ? 'checkDropDown' : (type == 'from') ? 'fromDropDown' : (type == 'to') ? 'toDropDown' : '');
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Sonuç Bulunamadı.</span>")
    }
}

function createHtml(results, type){
    if(results == null) return alert("object is null");

    if (type == 'shipmentCode'){
        $('#checkModalLabel').html('Gönderi Takip');
        var c = results.activities.length;
        console.log(c);
        return `<span ${c > 0 ? ' class="aSpan"': ''}>Paketlendi</span>
        <span class="${c > 1 ?  "aSpan" : ''} ${c == 1 ? "blink": ''}">Aktarmada</span>
        <span class="${c > 2 ? "aSpan": ''} ${c == 2 ? "blink": ''}">Dağıtım Şubesinde</span>
        <span class="${c > 3 ? "aSpan": ''} ${c == 3 ? "blink": ''}">Kuryede</span>
        <span class="${c > 4 ? "aSpan": ''} ${c == 4 ? "blink": ''}">Teslim Edildi</span>`
    }else if ( type == 'checkDropDown'){
        $('#branch-dropdown').css('visibility','visible').fadeIn();
        
        return `<span id="branch-dropdown-btn" data-id="${results._id}">${results.name}</span>`;
    }else if ( type == 'branch'){
        $('#checkModalLabel').html(`Şube Sorgulama: ${results.name}`);
        
        return `<button class="btn btn-outline-success" disabled>Şuan da Açık</button>`;
    }else if ( type == 'fromDropDown'){
        $('.from-dropdown').css('visibility','visible').fadeIn();
        
        return `<span id="from-dropdown-btn" data-id="${results._id}">${results.name}</span>`;
    }else if ( type == 'toDropDown'){
        $('#to-dropdown').css('visibility','visible').fadeIn();
        
        return `<span id="to-dropdown-btn" data-id="${results._id}">${results.name}</span>`;
    }else if ( type == 'calculate'){
        console.log(results);
        $('#checkModalLabel').html(`Fiyat Hesaplama: ${results.data.price} TL`);
        
        return `<button class="btn btn-outline-success" disabled>${results.data.from} ===> ${results.data.to}</button>`;
    }
}

function closeActivePopup(container, input, bool){
    console.log("in");
    $("body").click(function(e) {
        container.fadeOut();
        container.html('');
        if(input != null & bool){
            input.val('');
        }
    });
}

function cleare() {
    $("body").off('click');
}

$("#submitLogin").click(function(e){
    e.preventDefault()
    loading('#submitLogin p');
    var code = $("#loginCode").val().trim();
    var pass = $("#loginPass").val().trim();
    if( code != "" && pass != "" ){
        $.ajax({
            url:'/branch/login',
            type:'post',
            data:{code:code,pass:pass},
            success: function(response) {
                stopLoading('#submitLogin p');
                errorMessage = "";
                if(response){
                    Swal.fire({
                        icon: 'success',
                        title: 'Giriş Başarılı',
                    }).then((e) =>  {
                        window.location = "/admin/dashboard";
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata...',
                        text: 'Kod yada şifreniz yanlış!',
                    });
                }
                var pass = $("#loginPass").val('');
            }
        });
    }else {
        stopLoading('#submitLogin p');
        Swal.fire({
            icon: 'error',
            title: 'Hata...',
            text: 'Tüm alanları doldurmalısınız!',
        });
    }
});

$('#createCargo').click(function (e) {
    e.preventDefault()
    loading('#submitUpdateProfile p');
    let username = $('#userName').val();
    let to = $('#toInput').attr('data-id');
    if (username && to && to !== '0'){
        $.ajax({
            url:'/shipment/create',
            type:'post',
            data:{username:username, to:to},
            success: function(response) {
                stopLoading('#submitUpdateProfile p');
                errorMessage = "";
                console.log(response);
                if(response){
                    Swal.fire({
                        icon: 'success',
                        title: 'Kargo Eklendi',
                        text: 'Kargo Takip: '+response.code
                    }).then((result) =>  {
                        location.reload();
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata...',
                        text: 'Birşeyler ters gitti',
                    });
                }
            }
        });
    }else {
        stopLoading('#submitUpdateProfile p');
        Swal.fire({
            icon: 'error',
            title: 'Hata...',
            text: 'Tüm alanlar doldurulmalı',
        });
    }
});

$('#updateCargoStatus').click(function (e) {
    e.preventDefault()

    loading('#submitUpdateProfile p');
    let code = $('#cargoCode').val()
    let status = $('.options li.active').attr('rel')
    console.log(code)
    console.log(status)
    if (code && status && status !== 'undefined'){
        $.ajax({
            url:'/shipment/updateStatus',
            type:'post',
            data:{code:code, status:status},
            success: function(response) {
                stopLoading('#submitUpdateProfile p');
                errorMessage = "";
                console.log(response);
                if(response){
                    Swal.fire({
                        icon: 'success',
                        title: 'Güncellendi',
                    }).then((e) =>  {
                        location.reload();
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata...',
                        text: 'Birşeyler ters gitti',
                    });
                }
            }
        });
    }else {
        stopLoading('#submitUpdateProfile p');
        Swal.fire({
            icon: 'error',
            title: 'Hata...',
            text: 'Tüm alanlar doldurulmalı',
        });
    }
})

$("#submitUpdateProfile").click(function (e) {
    e.preventDefault()
    loading('#submitUpdateProfile p');
    var name = $("#branchName").val().trim();
    if( name != ""){
        $.ajax({
            url:'/branch/updateProfile',
            type:'post',
            data:{name:name},
            success: function(response) {
                stopLoading('#submitUpdateProfile p');
                errorMessage = "";
                if(response){
                    Swal.fire({
                        icon: 'success',
                        title: 'Güncellendi',
                    }).then((e) =>  {
                        location.reload();
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata...',
                        text: 'Birşeyler ters gitti',
                    });
                }
            }
        });
    }else {
        stopLoading('#submitUpdateProfile p');
        Swal.fire({
            icon: 'error',
            title: 'Hata...',
            text: 'Tüm alanları doldurmalısınız!',
        });
    }
});

function getUserData() {
    let branchId = $('#branchId').val();
    if (branchId && branchId !== 'undefined' && branchId !== undefined){
        $.ajax({
            url:'/branch/'+branchId,
            type:'get',
            success: function(data) {
                if(data){
                    $('#branchName').val(data.name)
                }
            }
        });
    }
}

function loading(button) {
    $(button).html('Yükleniyor...');
    $('.loader').fadeIn();
}

function stopLoading(button) {
    $(button).html('Giriş Yap');
    $('.loader').fadeOut();


}

/*select functions*/
var defaultselectbox = $('#cusSelectbox');
var numOfOptions = $('#cusSelectbox').children('option').length;

// hide select tag
defaultselectbox.addClass('s-hidden');

// wrapping default selectbox into custom select block
defaultselectbox.wrap('<div class="cusSelBlock"></div>');

// creating custom select div
defaultselectbox.after('<div class="selectLabel"></div>');

// getting default select box selected value
$('.selectLabel').text(defaultselectbox.children('option').eq(0).text());

// appending options to custom un-ordered list tag
var cusList = $('<ul/>', { 'class': 'options'} ).insertAfter($('.selectLabel'));

// generating custom list items
for(var i=0; i< numOfOptions; i++) {
    $('<li/>', {
        text: defaultselectbox.children('option').eq(i).text(),
        rel: defaultselectbox.children('option').eq(i).val()
    }).appendTo(cusList);
}

// open-list and close-list items functions
function openList() {
    for(var i=0; i< numOfOptions; i++) {
        $('.options').children('li').eq(i).attr('tabindex', i).css(
            'transform', 'translateY('+(i*100+100)+'%)').css(
            'transition-delay', i*30+'ms');
    }
}

function closeList() {
    for(var i=0; i< numOfOptions; i++) {
        $('.options').children('li').eq(i).css(
            'transform', 'translateY('+i*0+'px)').css('transition-delay', i*0+'ms');
    }
    $('.options').children('li').eq(1).css('transform', 'translateY('+2+'px)');
    $('.options').children('li').eq(2).css('transform', 'translateY('+4+'px)');
}

// click event functions
$('.selectLabel').click(function () {
    $(this).toggleClass('active');
    $('#updateCargoStatus').toggleClass('hidden');
    if( $(this).hasClass('active') ) {
        openList();
        focusItems();
    }
    else {
        closeList();
    }
});

$(".options li").on('keypress click', function(e) {
    e.preventDefault();
    $('#updateCargoStatus').toggleClass('hidden');
    $('.options li').siblings().removeClass();
    $(this).addClass('active');
    closeList();
    $('.selectLabel').removeClass('active');
    $('.selectLabel').text($(this).text());
    defaultselectbox.val($(this).text());
    $('.selected-item p span').text($('.selectLabel').text());
})

function focusItems() {

    $('.options').on('focus', 'li', function() {
        $this = $(this);
        $this.addClass('active').siblings().removeClass();
    }).on('keydown', 'li', function(e) {
        $this = $(this);
        if (e.keyCode == 40) {
            $this.next().focus();
            return false;
        } else if (e.keyCode == 38) {
            $this.prev().focus();
            return false;
        }
    }).find('li').first().focus();

}
