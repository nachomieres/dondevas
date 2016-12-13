import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
  public fireAuth: any;

  constructor() {
    this.fireAuth = firebase.auth(); // We are creating an auth reference.
    console.log('Hello AuthData Provider');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): any {
    return this.fireAuth.signOut();
  }
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  signupUser(nombre: string, email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: nombre,
        photoURL: null
      });
      /*this.userProfile.child(newUser.uid).set({
        email: email
      });*/
    });
  }
}
