var assert = require('assert');
const tempy = require('tempy');
const fs = require('fs-extra');

import Element from '../../src/models/element';
import Config from '../../src/components/config';
import { json } from 'body-parser';

// not actually encrypted
let jsonString = '{"contents":{"encrypted":"22aa2c00a11fc4edc9044204e65b1f72"},"id":"12345"}';
let jsonObj = JSON.parse(jsonString);

describe('Element', () => {
  describe('element()', () => {
    it ('should contain an empty object named "contents"', () => {
      let el = new Element();
      assert.deepStrictEqual(el.contents, {});
      assert.deepStrictEqual(el.id, "");
    });

    it('should accept JSON as argument to constructor', () => {
      let el = new Element(jsonObj);
      assert.deepStrictEqual(el.contents, jsonObj.contents);
      assert.deepStrictEqual(el.id, jsonObj.id);
    });

    it ('should be able to parse JSON', () => {
      let el = new Element();
      // should parse to el.contents
      el.fromString(jsonString);
      assert.deepStrictEqual(el.contents, jsonObj.contents);
      assert.deepStrictEqual(el.id, jsonObj.id);
    });

    it ('should be able to stringify the contents', () => {
      let el = new Element(jsonObj);
      assert.strictEqual(el.toString(), jsonString);
    });
  });
});

