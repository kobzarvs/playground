const WIDTH = 80;
const HEIGHT = 50;
const PADDING = 12;
const BORDER_WIDTH = 2;

render(
  col(
    row(
      col(
        div(
          div(`.pl(${PADDING})`).border(0, 'gray').center().bg('white')
        ).w(WIDTH).border(BORDER_WIDTH, 'blue').pl(PADDING).bg('lightgray'),
        div(
          div(`.px(${PADDING})`).border(0, 'gray').center().bg('white')
        ).w(WIDTH).border(BORDER_WIDTH, 'blue').px(PADDING).bg('lightgray'),
        div(
          div(`.pr(${PADDING})`).border(0, 'gray').center().bg('white')
        ).w(WIDTH).border(BORDER_WIDTH, 'blue').pr(PADDING).bg('lightgray'),
      ).gap(5).w('max-content')
    ).w(WIDTH * 3).gap(5)
    ,
    row(
      col(
        div(`.p(${PADDING})`).border(0, 'gray').center().bg('white').size('100%')
      ).size(WIDTH, HEIGHT).border(BORDER_WIDTH, 'blue').p(PADDING).bg('lightgray'),

      col(
        div(`.py(${PADDING})`).border(0, 'gray').center().bg('white').size('100%')
      ).size(WIDTH, HEIGHT).border(BORDER_WIDTH, 'blue').py(PADDING).bg('lightgray'),

      col(
        div(`.pt(${PADDING})`).border(0, 'gray').center().bg('white').size('100%')
      ).size(WIDTH, HEIGHT).border(BORDER_WIDTH, 'blue').pt(PADDING).bg('lightgray'),

      col(
        div(`.pb(${PADDING})`).border(0, 'gray').center().bg('white').size('100%')
      ).size(WIDTH, HEIGHT).border(BORDER_WIDTH, 'blue').pb(PADDING).bg('lightgray'),
    ).gap(5).left()
  ).gap(5),

  col(
    row(
      col(
        div(
          div(`.ml(${PADDING})`).border(BORDER_WIDTH, 'red').center().bg('white').ml(PADDING)
        ).w(WIDTH).bg('lightgray'),
        div(
          div(`.mx(${PADDING})`).border(BORDER_WIDTH, 'red').mx(PADDING).center().bg('white')
        ).w(WIDTH).bg('lightgray'),
        div(
          div(`.mr(${PADDING})`).border(BORDER_WIDTH, 'red').mr(PADDING).center().bg('white')
        ).w(WIDTH).bg('lightgray'),
      ).gap(5).w('max-content')
    ).w(WIDTH * 3).gap(5),

    row(
      div(
        div(`.m(${PADDING})`).border(BORDER_WIDTH, 'red').m(PADDING).center().bg('white')
      ).w(WIDTH).bg('lightgray'),

      col(
        div(`.my(${PADDING})`).border(BORDER_WIDTH, 'red').my(PADDING).center().bg('white').size('100%')
      ).w(WIDTH).h(HEIGHT).bg('lightgray'),

      col(
        div(`.mt(${PADDING})`).border(BORDER_WIDTH, 'red').mt(PADDING).center().bg('white').size('100%')
      ).w(WIDTH).h(HEIGHT).bg('lightgray'),

      col(
        div(`.mb(${PADDING})`).border(BORDER_WIDTH, 'red').mb(PADDING).center().bg('white').size('100%')
      ).w(WIDTH).h(HEIGHT).bg('lightgray').bottom(),
    ).gap(5).top()
  ).gap(5)

).pos({width: 500, height: 300})
