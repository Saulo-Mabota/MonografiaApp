import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataserviceService,Note } from 'src/app/services/dataservice/dataservice.service'; 
@Component({
  selector: 'app-opennote',
  templateUrl: './opennote.page.html',
  styleUrls: ['./opennote.page.scss'],
})
export class OpennotePage implements OnInit {


  @Input() id!: any; // GET THE ID
  //note: Note = {title: '', text: '' };
  //note: Note = null;
  note!: Note;
  constructor(
    private dataService: DataserviceService,
    private modalCrtl: ModalController,
    private toastCrtl: ToastController
  ) { }
  ngOnInit() {
    this.dataService.getNoteById(this.id).subscribe( res => {
    this.note = res;
     // console.log('MY ID ',res);
    });
  }
  async updateNote(){
    this.dataService.updateNote(this.note);
    const toast = await this.toastCrtl.create({
      message:'Notícias atualizada com sucesso!',
      duration:1000
    });
    this.modalCrtl.dismiss();
    toast.present();
  }
 async deleteNote(){
  await this.dataService.deleteNote(this.note);
  const toast = await this.toastCrtl.create({
    message:'Notícias apagada sucesso!',
    duration:1000
  });
  toast.present();
  this.modalCrtl.dismiss();
 }

}
