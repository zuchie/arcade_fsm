StateMachine = {

  //---------------------------------------------------------------------------

  create: function(cfg) {

    var target  = cfg.target || {};
    var initial = cfg.state;
    var events  = cfg.events;

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = window.document,
        win = window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    window.ctx = ctx;

    var n, event, name;
    for(n = 0 ; n < events.length ; n++) {
      event = events[n];
      name  = event.name;
      target[name] = this.buildEvent(name, event.from, event.to, target);
    }

    target.current = 'none';
    /*
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    */
    //Resources.onReady(this.buildEvent('startup', 'none', initial, target).call(target));
    this.buildEvent('startup', 'none', initial, target, canvas).call(target);

    return target;
  },

  //---------------------------------------------------------------------------

  buildEvent: function(name, from, to, target, canvas) {

    return function() {

      var beforeEvent = this['onbefore' + name];
      if (beforeEvent && (false === beforeEvent.call(this, ctx)))
        return;
      this.current = to;

      var enterState = this['onenter' + to] || this['on' + to];
      if (enterState)
        enterState.call(this, ctx, canvas);

      var afterEvent = this['onafter'  + name] || this['on' + name];
      if (afterEvent)
        afterEvent.call(this, ctx, canvas);
    }

  }

  //---------------------------------------------------------------------------

};

