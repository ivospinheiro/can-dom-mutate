var QUnit = require('steal-qunit');
var domMutate = require('../can-dom-mutate');

QUnit.module('can-dom-mutate', function () {
	QUnit.test('onNodeInsertion should be called when that node is inserted', function (assert) {
		var done = assert.async();
		var parent = document.getElementById('qunit-fixture');
		var child = document.createElement('div');

		var undo = domMutate.onNodeInsertion(child, function (mutation) {
			var node = mutation.target;
			assert.equal(node, child, 'Node should be the inserted child');

			undo();
			done();
		});

		parent.appendChild( child );
	});

	QUnit.test('onNodeRemoval should be called when that node is removed', function (assert) {
		var done = assert.async();
		var parent = document.getElementById('qunit-fixture');
		var child = document.createElement('div');

		var undo = domMutate.onNodeRemoval(child, function (mutation) {
			var node = mutation.target;
			assert.equal(node, child, 'Node should be the removed child');

			undo();
			done();
		});

		parent.appendChild(child);
		parent.removeChild( child );
	});

	QUnit.test('onNodeAttributeChange should be called when that node\'s attributes change', function (assert) {
		var done = assert.async();
		var child = document.createElement('div');
		var attributeName = 'foo';
		child.setAttribute(attributeName, 'bar');

		var undo = domMutate.onNodeAttributeChange(child, function (mutation) {
			assert.equal(mutation.target, child, 'Node should be the removed child');
			assert.equal(mutation.attributeName, attributeName);
			assert.equal(mutation.oldValue, 'bar');

			undo();
			done();
		});

		child.setAttribute(attributeName, 'baz');
	});

	QUnit.test('onInserted should be called when any node is inserted', function (assert) {
		var done = assert.async();
		var parent = document.getElementById('qunit-fixture');
		var child = document.createElement('div');

		var undo = domMutate.onInsertion(document.documentElement, function (mutation) {
			assert.equal(mutation.target, child, 'Node should be the inserted child');

			undo();
			done();
		});

		parent.appendChild(child);
	});

	QUnit.skip('onInserted should be called with inserted fragment subtree', function (assert) {
		assert.expect(3);
		var done = assert.async();
		var parent = document.getElementById('qunit-fixture');
		var fragment = new DocumentFragment();
		var child1 = document.createElement('div');
		child1.id = 'child1';
		var child2 = document.createElement('div');
		child2.id = 'child2';
		var grandchild = document.createElement('div');
		grandchild.id = 'grandchild';
		fragment.appendChild(child1);
		fragment.appendChild(child2);
		child2.appendChild(grandchild);

		var dispatchCount = 0;
		var nodes = [child1, child2, grandchild];
		var undo = domMutate.onInsertion(document.documentElement, function (mutation) {
			var target = mutation.target;
			if (nodes.indexOf(target) !== -1) {
				dispatchCount++;
				if (target === child1) {
					assert.ok(true, 'child1 dispatched');
				}
				if (target === child2) {
					assert.ok(true, 'child2 dispatched');
				}
				if (target === grandchild) {
					assert.ok(true, 'grandchild dispatched');
				}
				if (dispatchCount >= nodes.length) {
					undo();
					done();
				}
			}
		});

		parent.appendChild(fragment);
	});

	QUnit.test('onRemoval should be called when any node is removed', function (assert) {
		var done = assert.async();
		var parent = document.getElementById('qunit-fixture');
		var child = document.createElement('div');

		var undo = domMutate.onRemoval(document.documentElement, function (mutation) {
			assert.equal(mutation.target, child, 'Node should be the removed child');

			undo();
			done();
		});

		parent.appendChild(child);
		parent.removeChild(child);
	});
});
