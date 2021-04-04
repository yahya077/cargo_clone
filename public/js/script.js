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
