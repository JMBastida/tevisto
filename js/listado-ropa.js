
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDTHgoOWfY0H21CuPedpR1RVnDI9gz9Hng",
    authDomain: "juan-santos.firebaseapp.com",
    databaseURL: "https://juan-santos.firebaseio.com",
    projectId: "juan-santos",
    storageBucket: "juan-santos.appspot.com",
    messagingSenderId: "403858924455",
    appId: "1:403858924455:web:7ebcf74b25ffd43b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();//Base de datos inicializo
  var products = [];//Firebase
  var prod_selected = [];//Seleccionados
  var select_final=[];
  var pack_size=6;

  getDataFirestore(0);
  function getDataFirestore(value) {
    products = [];
    db.collection("prueba").where("age", "==", value).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          //var lielem = $("#lista_ropa").append(`<div class="col-sm-6 col-md-3"><div class="thumbnail"><img style="width:100%;" src="${doc.data().image}" alt="imagen de prueba"><div class="caption"><h4 style="text-align:center;">${doc.data().name}</h4></div></div></div>`);
          products.push(doc.data());
      });
      console.log(products);
      getTemplateAjax('template-list.html',products,'#lista_ropa');
    });
  }

  window.onload=function(){
    $('.dropdown').click(function(){
      //$(this).siblings(".submenu").toggleClass('show');
      $(this).siblings(".submenu").toggleClass('hide');
    });

  }

  $('#btn_filter').click(function() {
    console.log("Filtro actualizado a: ");
    var valor=$("input[type='radio'][name='gender']:checked").val();
    console.log(valor);
    getDataFirestore(parseInt(valor));//pasamos el string a integer
    prod_selected = [];
  });

  function getTemplateAjax(template_path, withData, target_dom_element_id) {
    var template_path; // ruta de la plantilla
    $.ajax({
      url: template_path,
      dataType: "html",
      success: function (template_html) {
        var compiledTemplate = Template7.compile(template_html);
        var html_final = compiledTemplate(withData);
        $(target_dom_element_id).html(html_final);
      }
    });
  }

  function reply_click(clicked_id){
    var id=String(clicked_id);
    var boleano = true;
    console.log("esta es la id: "+id);
    var i;
    for (i = 0; i < prod_selected.length; i++) { 
      if (prod_selected[i]==id) {
        boleano=false;
        prod_selected.splice(i,1)
        document.getElementById("prod_counter").innerHTML = prod_selected.length.toString();
        $('#check'+id).toggleClass('flipped');
      }
    }
    if(boleano==true && prod_selected.length<pack_size){
      prod_selected.push(id);
      document.getElementById("prod_counter").innerHTML = prod_selected.length.toString();
      $('#check'+id).toggleClass('flipped');
    } 
    console.log(prod_selected);
    if(prod_selected.length==pack_size){
      $('#btn_test').removeClass('disabled');
      prods_selected(prod_selected);
    }else{
      $('#btn_test').addClass('disabled');
    }
  }

  $( "#small_pack" ).click(function() {
    pack_size=6;
    document.getElementById("pack_size").innerHTML = "6";
    console.log( "paquete pqueño seleccionado" );
  });
  $( "#big_pack" ).click(function() {
    pack_size=10;
    document.getElementById("pack_size").innerHTML = "10";
    console.log( "paquete grande seleccionado" );
  });

  function prods_selected(array){
    select_final = [];
    var value;
    for (i = 0; i < array.length; i++) { 
      value=parseInt(prod_selected[i]);
      select_final.push(products[value]);
    }
    console.log(select_final);
  }
  /*lo que deberia hacer para la compra sería lo siguiente:
  -Al click creamos un vector almacenando la posicion del objeto del vector productos
  -Luego usamos ese nuevo vecrtor para pillar del vector productos su ID de esa forma saber que productos de la base de datos han sido seleeccionados
  -Una vex hecho el pago se alamcenara en la base de datos info relativa a paquete y que productos gracias a sus IDs
  */
  