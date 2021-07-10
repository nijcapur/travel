import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'rs-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IFrameComponent implements OnInit {
  @Input() public scrUrl: string;
  @Input() public youTubeUrl = false;
  public classToApply: string = null;
  public isMobile = false;
  public safeUrl;
  constructor(private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef,
              public deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.scrUrl);
    this.isMobile = this.deviceService.isMobile() || window.innerWidth <= 1024;
    this.classToApply = this.youTubeUrl ? (this.isMobile ? 'youTubeClassMobile' : 'youTubeClass') : 'w-100 frameClass';
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth <= 1024;
    this.classToApply = this.youTubeUrl ? (this.isMobile ? 'youTubeClassMobile' : 'youTubeClass') : 'w-100 frameClass';
    this.cdRef.detectChanges();
  }

}
