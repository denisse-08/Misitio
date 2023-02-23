import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import { User } from '../models/user';
import {MessageService} from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private messageService: MessageService
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge:true
    });
  }

  login(email:string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(result=>{
      this.setUserData(result.user);
      this.afAuth.authState.subscribe(user=>{
        if (user) {
          this.messageService.add({severity:'success', summary: 'Bienvenido'});
          this.router.navigate(['home']);
        }
      })
    }).catch(()=>{
      this.messageService.add({severity:'error', summary: 'Usuario o contrasena incorrecta', detail: ''});
    })
  }

  register(email:string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email,password)
    .then(result=>{
      result.user?.sendEmailVerification();
      this.setUserData(result.user);
      this.router.navigate(['login'])
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Cuenta creada correctamente'});
    }).catch(()=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear cuenta, el usuario ya existe'});
    })
  }

  logout(){
    return this.afAuth.signOut().then(()=>{
      localStorage.removeItem('user');
      this.router.navigate(['login'])
    })
  }
}
