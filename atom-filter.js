(function (window) {

    var AtomEnumerator = function (a) {
        this.a = a;
        this.i = -1;
    };
    AtomEnumerator.prototype = {
        next: function () {
            this.i++;
            return this.i < this.a.length;
        },
        current: function () {
            return this.a[this.i];
        }
    };


    var AtomFilter = {
        truef: function () {
            return true;
        },
        falsef: function () {
            return false;
        },

        get: function (item, n) {
            if (!item)
                return;
            var i = n.indexOf('.');
            if (i == -1) {
                return item[n];
            }
            var l = n.substr(0, i);
            n = n.substr(i + 1);
            return AtomFilter.get(item[l], n);
        },

        compare: function (l, cmp, r) {
            switch (cmp) {
                case "==":
                    return l == r;
                case "<=":
                    return l <= r;
                case ">=":
                    return l >= r;
                case "<":
                    return l < r;
                case ">":
                    return l > r;
                case "!=":
                    return l != r;
                case "in":
                    var ae = new AtomEnumerator(r);
                    while (ae.next()) {
                        var item = ae.current();
                        if (item == l)
                            return true;
                    }
                    return false;
                case "has":
                    return AtomFilter.compare(r, "in", l);
                case "any":
                    var ae = new AtomEnumerator(l);
                    var rf = AtomFilter.filter(r);
                    while (ae.next()) {
                        var item = ae.current();
                        if (rf(item))
                            return true;
                    }
                    return false;
                case "all":
                    var ae = new AtomEnumerator(l);
                    var rf = AtomFilter.filter(r);
                    while (ae.next()) {
                        if (!rf(item))
                            return false;
                    }
                    return true;
                case "none":
                case "!all":
                    return !AtomFilter.compare(l, "all", r);
                case "!in":
                    return !AtomFilter.compare(l, "in", r);
                case "!has":
                    return !AtomFilter.compare(l, "has", r);
                case "!any":
                    return !AtomFilter.compare(l, "any", r);
                default:
                    return false;
            }
        },

        filter: function (q, cor) {
            // compiles json object into function
            // that accepts object and returns true/false

            if (q === true)
                return AtomFilter.truef;
            if (q === false || q === null || q === undefined)
                return AtomFilter.falsef;

            var ae = [];

            for (var i in q) {
                if (!q.hasOwnProperty(i))
                    continue;
                var v = q[i];
                if (/\$or/i.test(i)) {
                    ae.push(function (item) {
                        return AtomFilter.filter(v, true)(item);
                    });
                    continue;
                }
                if (/\$not/i.test(i)) {
                    ae.push(function (item) {
                        return !AtomFilter.filter(v, cor)(item);
                    });
                    continue;
                }
                var args = i.split(' ');
                if (args.length === 1) {
                    args = i.split(':');
                }

                var n = args[0];
                var cond = "==";
                if (args.length === 2) {
                    cond = args[1];
                }

                var left = function (item) {
                    return AtomFilter.get(item, n);
                };

                ae.push(function (item) {
                    return AtomFilter.compare(left(item), cond, v);
                });
            }

            return function (item) {

                var e = new AtomEnumerator(ae);
                while (e.next()) {
                    var ec = e.current();
                    if (ec(item)) {
                        if (cor) {
                            return true;
                        }
                    } else {
                        if (!cor)
                            return false;
                    }
                }
                return true;
            };

        }

    };

    window.$f = AtomFilter.filter;

})(window);