module.exports = {
    randomPassword: function () {
        var specials = '!@#$%^&*()_+{}:"?\|[];\',./`~';
        var lowercase = 'abcdefghijklmnopqrstuvwxyz';
        var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var numbers = '0123456789';
    
        var all = specials + lowercase + uppercase + numbers;
    
        String.prototype.pick = function (min, max) {
            var n, chars = '';
    
            if (typeof max === 'undefined') {
                n = min;
            } else {
                n = min + Math.floor(Math.random() * (max - min));
            }
    
            for (var i = 0; i < n; i++) {
                chars += this.charAt(Math.floor(Math.random() * this.length));
            }
    
            return chars;
        };
    
        String.prototype.shuffle = function () {
            var array = this.split('');
            var tmp, current, top = array.length;
    
            if (top) while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
    
            return array.join('');
        };
    
        return password = (specials.pick(1) + lowercase.pick(1) + uppercase.pick(1) + numbers.pick(1) + all.pick(6)).shuffle();
    },
}
