import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    ref: any;
    uid: any;
    linea: any[];
    userName: string;
    marker: any;

    constructor(public navCtrl: NavController, public params: NavParams) {
      this.uid = this.params.get ('uid');
      this.userName = this.params.get ('userName');
      this.ref = firebase.database().ref('rutas/'+this.uid);
    }

    ngOnInit(){
      this.addMarkers(this.loadMap());
    }

    loadMap(): any {
      let latLng = new google.maps.LatLng(51.507222222222, -0.1275);
      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.marker = new google.maps.Circle({
         strokeColor: '#000080',
         strokeOpacity: 1,
         strokeWeight: 2,
         fillColor: '#387ef5',
         fillOpacity: 0.6,
         map: this.map,
         center:  latLng,
         radius: 7
      });
      return this.map;
    } // loadMap

    addMarkers(map){
      let ref:any = this.ref;
      let uid:any = this.uid;
      let marker: any = this.marker;
      this.ref.on('child_added', function (data, prevChildKey) {
        let anterior, posAnterior: any;
        // Si el nodo anteior no es nulo (el primero) saca su valor de la base de datos y lo asigna
        // a posAnterior, si no, posAnterior = la primera posicion
        if (prevChildKey != null) {
          anterior =  ref.child (prevChildKey);
          anterior.on('value', function(snapshot) {
            posAnterior =  snapshot;
          });
        }
        else {
          posAnterior = data;
        }

        let latLng = new google.maps.LatLng(data.val().latitud, data.val().longitud);
        marker.setCenter (latLng);

        let flightPath = new google.maps.Polyline({
          path: [(new google.maps.LatLng(posAnterior.val().latitud, posAnterior.val().longitud)),
                  (new google.maps.LatLng(data.val().latitud, data.val().longitud))],
          geodesic: true,
          strokeColor: '#444',
          strokeOpacity: 0.9,
          strokeWeight: 4
        });

        flightPath.setMap(map);
        map.setCenter(latLng);
      }); // this.ref.on ('child_added')
    } // addMakers
  } // clase HomePage
