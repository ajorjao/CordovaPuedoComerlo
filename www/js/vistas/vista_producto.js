var consulta_exitosa = false;
var pdata = {};
var current_user = 0;
var comment_stored = 0;

function modo_sin_conexion(){
  // Retrieve the object from storage
  var retrievedObject = localStorage.getItem('pdata');
  pdata = JSON.parse(retrievedObject);

  srcimg = "img/nono.png";
  detalle = '<div class="alert alert-danger" style="overflow: auto;" role="alert">\
                <div class="row">\
                  <div class="col-xs-3">\
                    <img src="'+srcimg+'" alt="..." style="width: 65px;margin-left: 6px;position: absolute;"> \
                  </div>\
                  <div class="col-xs-9" style="top: 4px;margin-bottom: 8px;font-size: 18px;">\
                    Alguien de tu familia no puede comerlo debido a que posee problemas con  \
                  </div>\
                </div>\
            </div>';
  $("#productMatch").append(detalle);
  $('#MenuRecomendar').remove() //se borran los botones para recomendar y reportar
  $('#menu3').remove()

  var n = 0
  userdata = JSON.parse(localStorage.getItem('usuario'))
  // console.log(userdata.intolerancias)
  // console.log(pdata.matchs)  

  all_intolerances = ["la lactosa","el gluten","el maní","las nueces","el apio","la mostaza","el huevo","el sesamo","el pescado","los crustaceos","los mariscos","la soya","los sulfitos","el lupino"]
  $.each(pdata.matchs, function(pos, intolerancia) {
    if ( userdata.intolerancias.indexOf(intolerancia) != -1){
      console.log("problema con la intolerancia: "+intolerancia);
      $('#menu2 .alert.alert-danger .row .col-xs-9').append(" "+all_intolerances[intolerancia-1])
    }
  });

  $("#product-name").html(pdata.pname);
  $("#product-id").html(pdata.pid);
  $("#product-ingredients").html(pdata.ingredients);
  $("#product-image").attr("src", pdata.image_route);

  setTimeout(function(){
    $('#alert .alert.alert-danger button').remove() //se borra el boton de recargar la pagina ya que el producto no aparecerá nunca con conexion
    // el problema de lo de abajo era que no existia un server al que se estubiera conectado por lo que no se podia hacer la busqueda (sin tener el ping)
    // $('#alert .alert.alert-danger button').removeAttr("onclick");
    // $('#alert .alert.alert-danger button').attr("onclick","\
    //   localStorage.removeItem('alert_data');\
    //   loading('Buscando producto','Estamos verificando si puedes comer este producto', 1000);\
    //   match_product("+pdata.pid+");");
  }, 0);
}

function get_my_data(){
  // $( '#my-slider' ).sliderPro({
  //   forceSize:'fullWidth',
  //   fade:true,
  //   buttons:false,
  //   keyboard:false,
  //   touchSwipe:false,
  //   autoplayOnHover:'none',
  // });

  var retrievedObject = localStorage.getItem('pdata');
  pdata = JSON.parse(retrievedObject);
  if ($.isEmptyObject(pdata.pname)){
    window.location = "producto_no_encontrado.html";
  }

  // console.log(pdata.matchs);
  if (!$.isEmptyObject(pdata.matchs)){ //si no puede comerlo
    class1 = "alert alert-danger";
    srcimg = "img/nono.png";
    detalle = '<div class="'+class1+'" style="overflow: auto; margin-bottom: 10px;" role="alert">\
                <h3 style="margin: 0px;">\
                  <div class="row">\
                    <div class="col-xs-3">\
                      <img  src="'+srcimg+'" alt="..." style="width: 65px;margin-left: 6px;position: absolute;"> \
                    </div>\
                    <div class="col-xs-9" style="top: 4px;margin-bottom: 8px;font-size: 28px;">\
                      No Puede Comerlo:\
                    </div>\
                  </div>\
                </h3>\
                <div class="row" style="margin: 0 0 0 100px; font-size: 16px;" id="cant-eat"> </div>\
              </div>\
              <div class="panel panel-danger">\
                <div class="panel-heading">\
                  <span>Posibles síntomas para tu familia:</span>\
                </div>\
                <div class="alert alert-info alert-dismissible fade in" role="alert" style="margin-bottom: 0; padding-top: 10px; padding-bottom: 10px;">\
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="margin-bottom: 0;">\
                    <span aria-hidden="true">&times;</span>\
                  </button>\
                  (Selecciona a cada familiar para ver sus posibles sintomas)\
                </div>\
                <div class="well panel" style="overflow: auto; margin-bottom: 0;">\
                  <div id="intolerancesMatchs">\
                  </div>\
                </div>\
              </div>';
    $('#menuR').show()
    $('#menuR2').show()
    get_recomendaciones();
  }
  else{
    $("#intolerancesMatchs").append('Todos en tu familia pueden comer este producto');
    detalle = '<div class="alert alert-success" style="overflow: auto; margin-bottom: 10px;" role="alert"> \
                <h3 style="margin: 0px;"> \
                  <div class="row">\
                    <div class="col-xs-3"> \
                      <img src="img/sisi.png" alt="..." style="width: 65px;margin-left: 6px;margin-top: 13px;position: absolute;"> \
                    </div>\
                    <div class="col-xs-9" style="top: 4px;margin-bottom: 8px;font-size: 30px;"> \
                      Pueden Comerlo! \
                    </div> \
                  </div> \
                </h3>\
              <div class="row" style="margin: 0 0 0 100px; font-size: 16px;" id="cant-eat">\
              - Este producto no presenta ingredientes que afecten la salud de tu familia.<br></div>\
              </div>';
  }
  $("#productMatch").append(detalle);

  var n = 0
  $.each(pdata.matchs, function(familiar, intolerancias) {
    // console.log(familiar,":", intolerancias);
    if ( intolerancias.length >= 1){
      n++;
      crear_mensaje_problema_con_familiar(familiar, intolerancias);
    }
  });

  $("#product-name").html(pdata.pname);
  $("#product-id").html(pdata.pid);
  $("#product-ingredients").html(pdata.ingredients);
  $("#product-image").attr("src", pdata.image_route);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/user",
    "method": "GET",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "e75d6d1f-85a5-fdce-0ff6-704ff358920b"
    },
    error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        location.reload();
      }
      else{
        not_loged();
      }
    }
  }

  $.ajax(settings).done(function (response) {
    current_user = response.user.id;
    get_comments(current_user);
  });

  // centrar la imagen cuando esta descuadrada (ej: 120x30)
  setTimeout(function(){
    imgheight = $("#product-image").height()
    if (imgheight < 120){
      $("#product-image").css('margin-top',60-imgheight/2+'px');
    }
  }, 300);

  //si el producto ya fue recomendado o denunciado
  current_product_denounces = JSON.parse(localStorage.getItem('product_denounces'));
  if (current_product_denounces){
    if (current_product_denounces[pdata.pid]=="denounced"){
      $('#denunciar').attr('disabled','true')
      $('#denunciar').text('Este producto ya lo denunciaste')
    }
    else if (current_product_denounces[pdata.pid]=="recommended"){
      $('#recomendar').attr('disabled','true')
      $('#recomendar').text('Este producto ya lo recomendaste')
    }
    if (current_product_denounces[pdata.pid]=="denounced_recommended"){
      $('#denunciar').attr('disabled','true')
      $('#denunciar').text('Este producto ya lo denunciaste')
      $('#recomendar').attr('disabled','true')
      $('#recomendar').text('Este producto ya lo recomendaste')
    }
  }
}


function crear_mensaje_problema_con_familiar(nombre_familiar, problemas_intolerancias){
  familiar = '\
    <a id="collapse_'+nombre_familiar+'" onclick="$(\'#\'+this.id+\' span\').toggleClass(\'glyphicon-chevron-right\'); $(\'#\'+this.id+\' span\').toggleClass(\'glyphicon-chevron-down\');" role="button" data-toggle="collapse" data-parent="#accordion" href="#sintomas_'+nombre_familiar+'" aria-expanded="false" aria-controls="collapseOne" style="font-size: 20px; color:#333;">\
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> '+ nombre_familiar.split("_-_")[0] +'\
    </a><br>\
    <div id="sintomas_'+nombre_familiar+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_'+nombre_familiar+'" style="margin-bottom: 20px;">';

  // console.log(problemas_intolerancias)
  for (i = 0, len = problemas_intolerancias.length; i < len; i++) {
    for (var familiar_intolerance in problemas_intolerancias[i]) {
      // console.log(problemas_intolerancias[i]);
      familiar += '\
      <div style="margin-left: 30px; font-size: 16px;">\
        <b>'+ familiar_intolerance +':</b> '+problemas_intolerancias[i][familiar_intolerance]+'\
      </div>';
    }
  }

  familiar += '\
    </div>'
  $("#intolerancesMatchs").append(familiar);
  // console.log('$("#cant-eat").append(\'- \''+nombre_familiar.split("_-_")[0]+'\'<br>\')')
  $("#cant-eat").append('- '+nombre_familiar.split("_-_")[0]+'<br>');
}

/////////////////// RECOMENDACIONES ///////////////////
  //se inicializa en el get_my_data
  function get_recomendaciones(){
    // productos que puedes comer
    var form = new FormData();
    var intol = JSON.parse(localStorage.getItem('usuario')).intolerancias;
    form.append("user_intolerances", intol);
    form.append("page", 1);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/recomended_products/",
      "method": "PUT",
        xhrFields: {
          withCredentials: true
        },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "aed9733b-b535-b5c4-4504-e0723d3efc88"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
      error: function(resp, status){
        if (resp.status==0){
          alert("Error al leer los comentarios")
          location.reload();
        }
        else{
          $("#productos_carrusel").append('\
            <li style="max-width: 130px">\
              <center>\
                '+JSON.parse(resp.responseText).error+'\
              <center>\
            </li>');
          if (recomended_1) {
            setTimeout(function(){
              initJCarousel();
            }, 500)  
          }
          else{
            recomended_2 = true
          }
        }
      }
    }

    var recomended_1 = false
    var recomended_2 = false

    $.ajax(settings).done(function (response) {
      resp = JSON.parse(response);

      // console.log("items carousel1: ");
      // console.log(resp.map(function(elem,i){return elem.name}));

      for (i = 0, len = resp.length; i < len; i++) {
        add_carrusel_item(resp[i].id, resp[i].name, resp[i].image_file_name, i);
      }

      // esto funciona ya que las busquedas de productos recomendados son asincronas
      if (recomended_2) {
        setTimeout(function(){
          initJCarousel();
          $('.product-image').map(function(index, elem){ 
            imgheight = $(elem).height()
            if (imgheight < 100){
              $(elem).css('margin-top',50-imgheight/2+'px');
            }
          })
        }, 500)
      }
      else{
        recomended_1 = true
      }
    });


    // productos que recomiendan personas con tus intolerancias
    var settings2 = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/get_recommended",
      "method": "GET",
        xhrFields: {
          withCredentials: true
        },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "aed9733b-b535-b5c4-4504-e0723d3efc88"
      },
      error: function(resp, status){
        if (resp.status==0){
          alert("Error al leer los comentarios")
          location.reload();
        }
        else{
          $("#productos_carrusel_2").append('\
            <li style="max-width: 130px">\
              <center>\
                '+JSON.parse(resp.responseText).error+'\
              <center>\
            </li>');
          if (recomended_1) {
            setTimeout(function(){
              initJCarousel();
            }, 500)  
          }
          else{
            recomended_2 = true
          }
        }
      }
    }

    $.ajax(settings2).done(function (response2) {
      resp2 = response2.product;
      // console.log("items carousel2: ");
      // console.log(resp2.map(function(elem,i){return elem.name}));

      for (j = 0, len = resp2.length; j < len; j++) {
        add_carrusel_item2(resp2[j].id, resp2[j].name, resp2[j].image_file_name, j);
      }

      // // esto funciona ya que las busquedas de productos recomendados son asincronas
      if (recomended_1) {
        setTimeout(function(){
          initJCarousel();
          $('.product-image').map(function(index, elem){ 
            imgheight = $(elem).height()
            if (imgheight < 100){
              $(elem).css('margin', 50-imgheight/2+'px auto');
            }
          })
        }, 500)
      }
      else{
        recomended_2 = true
      }
    });
  }

  function add_carrusel_item(id, name, img_src, i){
    console.log()
    url_image_product = "http://"+url_server+img_src.replace("/original/","/thumb/")
    lista_item = '<li onclick="ver_detalle('+id+')">\
                    <center>\
                      <img class="product-image" style="max-height: 130px; max-width: 130px;" src="'+url_image_product+'">\
                      <b>'+name+'</b>\
                    </center>\
                  </li>';

    $("#productos_carrusel").append(lista_item);
  }

  function add_carrusel_item2(id, name, img_src, i){
    url_image_product = "http://"+url_server+img_src.replace("/original/","/thumb/")
    lista_item = '<li onclick="ver_detalle('+id+')">\
                    <center>\
                      <img class="product-image" style="max-height: 130px; max-width: 130px;" src="'+url_image_product+'">\
                      <b>'+name+'</b>\
                    </center>\
                  </li>';
              
    $("#productos_carrusel_2").append(lista_item);
  }

  function ver_detalle(id){
    loading("Buscando producto","Estamos verificando si puedes comer este producto", 1000);
    match_product(id);

    var testObject = { 'pid': id, 'pname': pname, 'matchs': matchs, 'ingredients': ingredients, 'image_route': image_route};
    localStorage.setItem('pdata', JSON.stringify(testObject));

    stop_loading();
    window.location = "vista_producto.html";
  }
//////////////// END RECOMENDACIONES //////////////////

///////////////////// COMENTARIOS /////////////////////
  //se inicializa en el get_my_data
  function get_comments( user_id ){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/product_comments/"+pdata.pid,
      "method": "GET",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "62f3283b-5118-e38d-7538-2b6ea2f3e39c"
      },
      error: function(resp, status){
        if (resp.status==0){
          alert("Error de conexion con el servidor al leer los comentarios")
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    $.ajax(settings).done(function (response) {
      var comment_likes = JSON.parse(localStorage.getItem('comment_likes'));
      var like_dislike = undefined;
      for (i = 0, len = response.comments.length; i < len; i++) {
        if (comment_likes){
          like_dislike = comment_likes[response.comments[i].id]; // like_dislike = ("like", "dislike" o undefined)
        }
        if (response.comments[i]["prom_likes"]>-15) {
          if (response.comments[i].user.id == user_id){
            add_comment(response.comments[i], true, like_dislike);
          }
          else{
            add_comment(response.comments[i], false, like_dislike);
          }
        }
        else{ //comentario bloqueado
          $("#product-comments").append('\
            <div class="panel-body" style="padding-left: 40px; color: red; border: 1px solid rgba(0,0,0,0.17);">\
              <div class="row">\
                '+response.comments[i]["user"]["username"]+': <b><i>Comentario bloqueado</i></b>\
              </div>\
              <div class="row">\
                [Este comentario fue bloqueado por tener demasiados votos negativos]\
              </div>\
            </div>');
        }
      }

      if (response.comments.length == 0){
        // add_comment("Aun no hay comentarios de este producto", false, undefined);
        comment = '\
        <div class="panel-body" style="border: 1px solid rgba(0,0,0,0.17)">\
          <div style="text-align: center">\
            <div class="row">\
              <i>Aun no hay comentarios para este producto</i>\
            </div>\
          </div>\
        </div>'
        $("#product-comments").append(comment);

      }
    });
  }

  //datos que recibe: (comentario{id,comentario,etc}), (si es un comentario propio (editable)), ("like": le di like - "dislike": le di dislike - null: no se ha dado nada)
  function add_comment(hash_comentario, ask_my_comment, like_dislike){
    comment = '\
    <div class="panel-body" style="border: 1px solid rgba(0,0,0,0.17)">\
      <div class="col-xs-8">\
        <div class="row">'
    if (ask_my_comment){
      comment += '\
        <a class="btn-default" onclick="center_modal();" data-toggle="modal" data-target="#editar-comentario-modal">\
          <i class="fa fa-pencil" aria-hidden="true" onclick="editar_comentario('+hash_comentario["id"]+',\''+hash_comentario["title"]+'\',\''+hash_comentario["description"]+'\')"></i>\
        </a>'
    }
    comment += '\
        '+hash_comentario["user"]["username"]+': <b>'+hash_comentario["title"]+'</b>\
        </div>\
        <div class="row">\
          '+hash_comentario["description"]+'\
        </div>\
      </div>\
      <div class="col-xs-4" style="text-align: center;">\
        <div id="prom_likes_'+hash_comentario["id"]+'">\
          '+hash_comentario["prom_likes"]+'\
        </div>\
        <a onClick="like('+hash_comentario["id"]+',\'like\')" id="likes_'+hash_comentario["id"]+'">\
          <span class="glyphicon glyphicon-thumbs-up" style="font-size: 2em;"></span>\
        </a>&nbsp;\
        <a onClick="like('+hash_comentario["id"]+',\'dislike\')" id="dislikes_'+hash_comentario["id"]+'">\
          <span class="glyphicon glyphicon-thumbs-down" style="font-size: 2em;"></span>\
        </a>\
      </div>\
    </div>'
    $("#product-comments").append(comment);
    // console.log("like_dislike del comentario "+hash_comentario["id"]+": "+like_dislike);
    if (like_dislike=="like"){
      $("#dislikes_"+hash_comentario["id"]).css('color','grey');
      $("#likes_"+hash_comentario["id"]).css('color','#23ff00');
      
      $("#dislikes_"+hash_comentario["id"]).removeAttr('onclick');
      $("#likes_"+hash_comentario["id"]).attr('onclick',"like("+hash_comentario["id"]+",\'like_cancel\')");
    }
    else if (like_dislike=="dislike") {
      $("#likes_"+hash_comentario["id"]).css('color','gray');
      $("#dislikes_"+hash_comentario["id"]).css('color','red');
      
      $("#likes_"+hash_comentario["id"]).removeAttr('onclick');
      $("#dislikes_"+hash_comentario["id"]).attr('onclick',"like("+hash_comentario["id"]+",\'dislike_cancel\')");
    }
  }


  function editar_comentario(comment_id, title, description){
    comment_stored = comment_id
    // script para escribir lo que dice el comentario en el modal
    $("#edit-title").val(title)
    $("#edit-description").val(description)
  }


  function delete_comentario(){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/comments/"+comment_stored,
      "method": "DELETE",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "a0cdee86-b34e-60fe-5224-619d0cb27c30"
      },
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión");
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    $.ajax(settings).done(function (response) {
      location.reload();
    });
  }


  function update_comentario(){
    var form = new FormData();
    form.append("title", $("#edit-title").val());
    form.append("description", $("#edit-description").val());

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/comments/"+comment_stored,
      "method": "PUT",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "a0cdee86-b34e-60fe-5224-619d0cb27c30"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión");
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    $.ajax(settings).done(function (response) {
      location.reload();
    });
  }


  function like(id_comentario, like_dislike){
    var form = new FormData();
    form.append(like_dislike, "true"); //like: true || dislike: true//

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/like_comment/"+id_comentario,
      "method": "PUT",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "02773620-b093-7aad-3ca1-73e82dfd7283"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión");
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    $.ajax(settings).done(function (response) {
      current_comment_likes = JSON.parse(localStorage.getItem('comment_likes'));
      if (current_comment_likes){
        current_comment_likes[id_comentario]=like_dislike;
        localStorage.setItem('comment_likes', JSON.stringify(current_comment_likes));
      }
      else{
        a = {}
        a[id_comentario] = like_dislike;
        localStorage.setItem('comment_likes', JSON.stringify(a));
      }

      $("#likes_"+id_comentario).removeAttr('onclick');
      $("#dislikes_"+id_comentario).removeAttr('onclick');
      prom_likes = parseInt($("#prom_likes_"+id_comentario).text())

      if (like_dislike=="like"){
        $("#prom_likes_"+id_comentario).text(prom_likes+1)

        $("#dislikes_"+id_comentario).css('color','grey');
        $("#likes_"+id_comentario).css('color','#23ff00');
        
        $("#likes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'like_cancel\')");
      }
      else if (like_dislike=="dislike") {
        $("#prom_likes_"+id_comentario).text(prom_likes-1)
        
        $("#likes_"+id_comentario).css('color','gray');
        $("#dislikes_"+id_comentario).css('color','red');
        
        $("#dislikes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'dislike_cancel\')");
      }
      else{
        $("#likes_"+id_comentario).removeAttr('style');
        $("#dislikes_"+id_comentario).removeAttr('style');

        $("#likes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'like\')");
        $("#dislikes_"+id_comentario).attr('onclick',"like("+id_comentario+",\'dislike\')");

        current_comment_likes = JSON.parse(localStorage.getItem('comment_likes'));
        if (current_comment_likes){
          delete current_comment_likes[id_comentario];
          localStorage.setItem('comment_likes', JSON.stringify(current_comment_likes));
        }
        if (like_dislike=="like_cancel"){
          $("#prom_likes_"+id_comentario).text(prom_likes-1)
        }
        else if (like_dislike=="dislike_cancel"){
          $("#prom_likes_"+id_comentario).text(prom_likes+1)
        }
      }
      // console.log("likes: "+JSON.parse(response).likes+", dislikes: "+JSON.parse(response).dislikes);
    });
  }


  function comentar(){
    var form = new FormData();
    form.append("title", $("#title").val());
    form.append("description", $("#description").val());
    form.append("product_id", pdata.pid);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/comments",
      "method": "POST",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "ec11ee2b-33d1-480d-00a2-bb12c6c834cd"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión")
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    $.ajax(settings).done(function (response) {
      $("#comentar-modal").modal('toggle');
      $("#title").val("");
      $("#description").val("");
      // $("#product-comments").html('\
      //     <div style="width: 95%; margin: 5px">\
      //       <button style="width: 75%; margin: 5px;" type="button" class="btn btn-default" data-toggle="modal" data-target="#comentar-modal">Comentar</button>\
      //     </div>');
      $("#product-comments").html('\
          <div style="text-align: center;">\
            <button onclick="center_modal();" style="width: 95%; margin: 5px;" type="button" class="btn btn-default" data-toggle="modal" data-target="#comentar-modal">Comentar</button>\
          </div>');
      get_comments(current_user);
    });
  }
/////////////////// END COMENTARIOS ///////////////////


///////////////// RECOMENDAR- DENUNCIAR ///////////////////
  function denunciar(){

    var form = new FormData();
    form.append("product_id", pdata.pid);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/denounce_product",
      "method": "POST",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "245521af-53b1-6a74-855b-343d227a24ac"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión")
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    var denuncia = confirm("¿Estás seguro que deseas denunciar "+pdata.pname+"?");
    if (denuncia == true) {
      $.ajax(settings).done(function (response) {
        current_product_denounces = JSON.parse(localStorage.getItem('product_denounces'));
        if (current_product_denounces){
          if (current_product_denounces[pdata.pid]=="recommended"){
            current_product_denounces[pdata.pid]="denounced_recommended";
            localStorage.setItem('product_denounces', JSON.stringify(current_product_denounces));
          }
          else{
            current_product_denounces[pdata.pid]="denounced";
            localStorage.setItem('product_denounces', JSON.stringify(current_product_denounces));
          }
        }
        else{ //inicializar los productos denunciados/recomendados
          a = {}
          a[pdata.pid] = "denounced";
          localStorage.setItem('product_denounces', JSON.stringify(a));
        }
        console.log(response);
        send_alert("<strong>Producto Denunciado Correctamente.</strong> Gracias por avisarnos.", "warning");
        location.reload();
      });
    }
  }

  function recomendar(){
    var form = new FormData();
    form.append("product_id", pdata.pid);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://"+url_server+"/recommend_product/"+pdata.pid,
      "method": "PUT",
      xhrFields: {
        withCredentials: true
      },
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "ab688606-d3c6-8ff2-049d-ef96ea10efc3"
      },
      error: function(resp, status){
        if (resp.status==0){
          alert("Error, por favor comprueba tu conexión");
        }
        else{
          send_alert(JSON.parse(resp.responseText).error, "danger");
        }
        location.reload();
      }
    }

    var recomienda = confirm("¿Deseas recomendar "+pdata.pname+"?");
    if (recomienda == true) {
      $.ajax(settings).done(function (response) {
        current_product_denounces = JSON.parse(localStorage.getItem('product_denounces'));
        if (current_product_denounces){
          if (current_product_denounces[pdata.pid]=="denounced"){
            current_product_denounces[pdata.pid]="denounced_recommended";
            localStorage.setItem('product_denounces', JSON.stringify(current_product_denounces));
          }
          else{
            current_product_denounces[pdata.pid]="recommended";
            localStorage.setItem('product_denounces', JSON.stringify(current_product_denounces));
          }
        }
        else{ //inicializar los productos denunciados/recomendados
          a = {}
          a[pdata.pid] = "recommended";
          localStorage.setItem('product_denounces', JSON.stringify(a));
        }
        console.log(response);
        send_alert("<strong>Has recomendado este producto satisfactoriamente</strong> :D", "success");
        location.reload();
      });
    }
  }
/////////////// END RECOMENDAR- DENUNCIAR ////////////////

function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}