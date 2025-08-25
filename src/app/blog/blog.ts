import { Component, ElementRef, signal, effect, ViewChild, HostListener } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { HttpClient } from '@angular/common/http';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog {
  protected readonly markdown = signal('');
  @ViewChild('progressBar') progressBar!: ElementRef;

  constructor(private el: ElementRef, private http: HttpClient) {
    this.http
      .get('portfolio.md', { responseType: 'text' })
      .subscribe((markdown) => {
        this.markdown.set(markdown);
      });

    effect(() => {
      if (this.markdown()) {
        // Use a timeout to allow the view to be updated with the new markdown
        setTimeout(() => this.animateContent(), 0);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.progressBar) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollY / scrollHeight) * 100;
      this.progressBar.nativeElement.style.width = `${scrollPercent}%`;
    }
  }

  private animateContent(): void {
    const el = this.el.nativeElement;

    gsap.from(el, {
      duration: 0.5,
      opacity: 0,
      ease: 'power1.out'
    });

    const animatedElements = el.querySelectorAll('h1, h2, h3, p, pre, blockquote, ul, ol');

    animatedElements.forEach((element: any) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
      });
    });
  }
}
