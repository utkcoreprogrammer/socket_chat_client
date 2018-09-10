import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { UserListService } from '../services/userList.service';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable()
export class ChatService {
	private baseUrl:string = environment.apiUrl;
	private socket = io.connect('http://localhost:9090');
  private username : string;


  constructor(private http:  HttpClient, private userService : UserService,private UserListService : UserListService, private route : ActivatedRoute, private router : Router) { 
      let that = this;
      console.log("socket>>>>>" ,this.socket);
      this.userService.getAllUsers().subscribe(users =>{

        that.UserListService.Users = users
        console.log("DAta loaded for firsst time in User List service >>>>>>>>>",that.UserListService.Users)

        this.socket.on("logged_in_user",(onlineUser)=>{
        let index = that.UserListService.Users.findIndex(x=>{return x.email == onlineUser.email})
        that.UserListService.Users[index] = onlineUser
        })
         
        this.socket.on("log_Out_User", (offlineUser) =>
        {
          let index = that.UserListService.Users.findIndex(x=>{return x.email == offlineUser.email})
          that.UserListService.Users[index] = offlineUser
        })
        
        this.socket.on("New_User_Registered", (newUser)=>
        {
          console.log("newUser>>", newUser);
          that.UserListService.Users.push(newUser);
        })

      })
      
   

  }

  joinRoom(data) {
    console.log("data from join room",data);
    this.socket.emit('join', data);
  }

  sendMessage(data) {
    console.log("message>>>>", data);
    this.socket.emit('message', data);
  }

  newMessageReceived() {
    const observable = new Observable<{ user: String, message: String}>(observer => {
      this.socket.on('new message', (data) => {
        this.socket.emit("hasTyped", )
        observer.next(data);
      });

      return () => {
         this.socket.disconnect();
      };
    });
    return observable;
  }
  receivedTyping() {
    const observable = new Observable<{ data : String, isTyping: boolean}>(observer => {
      this.socket.on('typing', (data) => {
        console.log("data from typing !#@#@#@#@##", data);
        observer.next(data);
        
      });
      return () => {
       this.socket.disconnect();

      };
      
    });
    
    return observable;
  }

    receivedGroupTyping() {
    const observable = new Observable<{ user : String, isTyping: boolean}>(observer => {
      this.socket.on('groupTyping', (data) => {
        observer.next(data);
        
      });
      return () => {
       this.socket.disconnect();

      };
      
    });
    
    return observable;
  }

  typing(data) {
    console.log("typing>>>>>>>>>>>", data);
    this.socket.emit('typing', data);
  }
  
  groupTyping(data){
    console.log("group typing>>>>>>>>>>>>>", data);
     this.socket.emit('groupTyping', data);
  }

 
}












