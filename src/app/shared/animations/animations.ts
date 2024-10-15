import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  group,
  animateChild,
} from '@angular/animations';

export const fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),
  transition(':enter, :leave', [animate(800)]),
]);

export const fadeSlide = trigger('fadeSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-250px)' }),
    animate(700, style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

export const slideInAnimation = trigger('routeAnimations', [
  transition('add <=> list', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('400ms ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('600ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [animate('400ms ease-out', style({ left: '100%', opacity: 0 }))],
        { optional: true }
      ),
      query(':enter', [animate('600ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);

export const routeTransitionAnimations = trigger('triggerName', [
  transition('list => add', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '12%',
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ right: '-100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1s ease-out', style({ right: '100%', opacity: 0 })),
      ]),
      query(':enter', [
        animate('1s ease-out', style({ right: '0%', opacity: 1 })),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('add => list', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '12%',
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: '-100%', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1s ease-out', style({ left: '100%', opacity: 0 })),
      ]),
      query(':enter', [
        animate('1s ease-out', style({ left: '0%', opacity: 1 })),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
]);
