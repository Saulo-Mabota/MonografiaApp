import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataserviceService,Note } from '../services/dataservice/dataservice.service'
// import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  data: any;
  noteId: any;
 // note: Note | undefined;
 information:any;
  profile: any;
  constructor(
  // private datePipe: DatePipe,
  private router: Router,
  private route: ActivatedRoute,
  private dataService: DataserviceService,
  private navCrtl: NavController) { }

ngOnInit() {
  this.noteId = this.route.snapshot.paramMap.get('id');
  this.dataService.getNoteById(this.noteId).subscribe((res: any) => {
    this.information = res;
    // console.log('MASSIVE DATA: ',note);
  });
  // this.dataService.getNoteImg(this.noteId).subscribe((data) => {
  //   this.profile = data; // IT SEND THE NOTE PICTURE TO PROFILE PAGE  
  //   // console.log(`FOTO:  ${this.profile}`);
  // });
}
goHome() {
  localStorage.setItem('mybackvalue', 'This is my way');
  this.navCrtl.setDirection('back');
  this.router.navigateByUrl('/home');

}
}
