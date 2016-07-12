/* eslint-disable max-len, no-unused-expressions, no-underscore-dangle, func-names */
const Dog = require('../../dst/models/dog');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Dog', () => { // top describe is the name of the class (use Dog if a model, dogs for controller)
  beforeEach(() => {
    sinon.stub(Dog, 'find').yields(null, []);
  });
  afterEach(() => {
    Dog.find.restore();
  });
  describe('#feed', () => {
    // it('should add 10 to the dogs health', sinon.test(function (done) {
    it('should add 10 to the dogs health', () => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 50,
                          toy: 'squeaky' });
      // this.stub(d, 'save').yields(null, { health: 60 });
      d.feed();
        // sinon.assert.calledOnce(d.save);
      expect(d.health).to.equal(60);
    });
    it('should max the dogs health at 100', () => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 95,
                          toy: 'squeaky' });
      d.feed();
      expect(d.health).to.equal(100);
    });
  });
  describe('constructor', () => { // # means instance method, . means static method
    it('should create a dog object', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 85,
                          toy: 'squeaky' });
      d.validate(err => {
        expect(err).to.be.undefined;
        expect(d.name).to.equal('fido');
        expect(d._id).to.be.ok; // 'ok' meaning it does exist
        expect(d.dateCreated).to.be.ok;
        done();
      }); // .validate is an asynchronous from mongoose, will give back an error that might occur.
      // because it is asynch, we need to have the (done) callback.
      // Mongoose does an internal validation, then it does a save.
      // Mongo is schema-less so it will take garbage.  Mongoose does the validation
    });
    it('should not create a dog object, given negative health', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: -50, // invalid value for health
                          toy: 'squeaky' });
      d.validate(err => {
        expect(err).to.be.ok; //
        done();
      });
    });
    it('should not create a dog object, name missing', (done) => {
      const d = new Dog({ age: 3, // name is missing
                          health: 50,
                          toy: 'squeaky' });
      d.validate(err => {
        expect(err).to.be.ok; //
        done();
      });
    });
    it('should not create a dog object, name too short', (done) => {
      const d = new Dog({ name: 'bo', // name too short, minlength: 3
                          age: 3,
                          health: 50,
                          toy: 'squeaky' });
      d.validate(err => {
        expect(err).to.be.ok; //
        done();
      });
    });
    it('should not create a dog object, invalid toy', (done) => {
      const d = new Dog({ name: 'bob',
                          age: 3,
                          health: 50,
                          toy: 'toaster oven' }); // invalid toy
      d.validate(err => {
        expect(err).to.be.ok; //
        done();
      });
    });
    // using sinon to create a stub for the database:
    // it is very important to release a stub after using it,
    // otherwise it will remain, and the next tests will use the stub as well
    // sinon.test takes the callback as an argument, and sinon automatically
    // releases the stub at the end of the test
// two lines below were before adding the beforeEach and afterEach
//    it('should not create a dog object, duplicate dog name', sinon.test(function (done) {
//      this.stub(Dog, 'find').yields(null, [{ dogName: 'max' }]); // the callback contains the error (null) and an array of dogs
    it('should not create a dog object, duplicate dog name', done => {
      Dog.find.yields(null, [{ dogName: 'max' }]); // the callback contains the error (null) and an array of dogs
      // the above line is saying that when Dog.find() is called, return { dogName: 'max' }
      const d = new Dog({ name: 'max',
                          age: 3,
                          health: 50,
                          toy: 'bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Dog.find, { name: 'max' }); // calledwith is called a "spy" because it is spying on the method
        done();
      });
    });
  });
});
