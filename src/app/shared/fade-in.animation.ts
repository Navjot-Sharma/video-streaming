import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  state('sort', style({
  })),
  transition(':enter', [
    style({
    opacity: 0,
    transform: 'translateY(-200px)'
  }),
  animate('1000ms ease-out')
]),
transition(':leave', [
  animate('700ms ease-in', style({
    opacity: 0,
    transform: 'translateY(-200px)'
  }))
])
]);

