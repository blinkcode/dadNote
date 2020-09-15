import { ActionSheetController } from '@ionic/angular';
import { FileService } from './../file/file.service';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { EventService } from './../events/event.service';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
    selector: 'app-pictures',
    templateUrl: './pictures.component.html',
    styleUrls: ['./pictures.component.scss'],
})
export class PicturesComponent implements OnInit {

    @Input()
    pictures: string[];
    @Input()
    thumbnails: string[];
    @Input()
    editable: boolean;
    constructor(
        private event: EventService,
        private modal1: ActionSheetController,
        private file: FileService,
        private toast: ToastService,
        private share: SocialSharing
    ) { }

    ngOnInit() { }

    async openModal(i: number) {
        // this.modal1.operation([
        //     {
        //         text: '查看图片', onPress: () => {
        //             this.openImg(i);
        //         }
        //     },
        //     {
        //         text: '删除图片', onPress: () => {
        //             setTimeout(() => {
        //                 this.delete(i);
        //             }, 400);
        //         }
        //     },
        //     { text: '取消', onPress: () => { } }
        // ]);
        const modal = await this.modal1.create({
            buttons: [{
                text: '查看图片',
                handler: () => {
                    this.openImg(i);
                }
            }, {
                text: '分享图片',
                handler: () => {
                    this.shareImg(i);
                }
            }, {
                text: '删除图片',
                role: 'destructive',
                handler: () => {
                    this.delete(i);
                }
            }, {
                text: '取消',
                role: 'cancel',
                handler: () => { }
            }]
        });
        await modal.present();
    }
    /**
     * 删除图片
     */
    delete(i) {
        if (!this.editable) {
            return false;
        }
        this.pictures.splice(i, 1);
        this.thumbnails.splice(i, 1);
        this.event.publish(i);
    }

    /**
     * 查看图片
     */
    openImg(i) {
        const filePath = this.pictures[i];
        this.file.seeImg(filePath).catch(err => {
            this.toast.fail('打开失败');
        })
    }

    shareImg(i: number) {
        const imgPath = this.pictures[i];
        this.share.share(null, null, imgPath, null).then(() => {
            this.toast.success('分享成功');
        }).catch(() => {
            this.toast.fail('分享失败');
        });
    }

}
