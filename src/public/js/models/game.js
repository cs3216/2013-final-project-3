NINJA_RADIUS = 20.0
SCALE = 30.0

var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.stage = null;
  this.colors = ['orange', 'red', 'blue', 'green'];

  this.box = new b2World(new b2Vec2(0, 0), true);
  var listener = new b2ContactListener();

  Box2D.customizeVTable(listener, [{
      original: Box2D.b2ContactListener.prototype.BeginContact,
      replacement:
          function (thsPtr, contactPtr) {
              var contact = Box2D.wrapPointer( contactPtr, b2Contact );
              var bodyA = contact.GetFixtureA().GetBody().actor;
              var bodyB = contact.GetFixtureB().GetBody().actor;

              bodyA.collide(bodyB);
              bodyB.collide(bodyA);
          }
  }]);
  this.box.SetContactListener(listener);
}

Game.prototype.addNinja = function(identifer) {
  if (this.colors.length === 0) return false;

  // var position = getFreePosition
  var position = new Vector2D(Math.random() * 500, 100);

  var fixture = new b2FixtureDef;
  fixture.set_density(1);
  fixture.set_restitution(0);
  fixture.set_friction(1.0);
  
  var shape = new b2CircleShape();
  shape.set_m_radius(NINJA_RADIUS / SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef;
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = this.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);
  
  var color = this.colors.splice(0, 1)[0];
  var ninja = new Ninja(identifer, color);
  ninja.size = NINJA_RADIUS;

  var view = new createjs.Shape();
  view.x = position.x;
  view.y = position.y;
  view.graphics.beginFill(color).drawCircle(0, 0, NINJA_RADIUS);

  ninja.body = body;
  ninja.body.actor = ninja;
  ninja.view = view;

  this.ninjas.push(ninja);
  this.stage.addChild(ninja.view);

  return true;
}