/**
 * Created by blmarket on 2/21/16.
 */
'use strict';

const EventEmitter = require('events');
const PouchDB = require('pouchdb'); // requires pouchdb dependency only for testing

const topic = require('../lib/observable_pouch');

describe('observable_pouch module', function() {
  it('exists', function(done) {
    expect(topic).not.toBe(null);
    done();
  });
  
  describe(":create_change method", function() {
    const method = topic.create_change;

    it('default module is function', function(done) {
      expect(method).toBeDefined();
      expect(typeof method).toBe('function');
      done();
    });
    
    function subscribe(db) {
    }

    it('unsubscription causes stop listening events', function(done) {
      const mockdb = new PouchDB('mockdb');
      const subscription = method(mockdb).subscribe(data => {
        console.log(data);
        mockdb.destroy().then(() => {
          subscription.unsubscribe();
        });
      }, err => {}, () => {
        console.log('subscription was completed!');
        // should be completed
        done();
      });

      mockdb.put({
        _id: 'somedoc',
        title: 'document here'
      });
    });
    
    it('provides single eventemitter for multiple subscribers', function(done) {
      const mockemitter = new EventEmitter();
      let cancel_count = 0;
      mockemitter.cancel = function() {
        done();
      };
      
      const mockdb = {
        changes() { return mockemitter; }
      };
      const topic = method(mockdb);
      const sub1 = topic.subscribe();
      const sub2 = topic.subscribe();
      
      sub1.unsubscribe();
      
      setTimeout(function() {
        expect(cancel_count).toBe(0);
        sub2.unsubscribe();
      }, 10);
    });
  });
  
  describe("module's default export", function() {
    const method = topic.default;
    
    it('default module is function', function(done) {
      expect(method).toBeDefined();
      expect(typeof method).toBe('function');
      done();
    });
    
    it('dispose should be executed on unsubscription', function(done) {
      const mockdb = new PouchDB();
      
      const factory = method(mockdb);
      const subscription = factory().subscribe(data => {
        console.log(data);
      });
      subscription.unsubscribe();
      done();
    });
  });
});

