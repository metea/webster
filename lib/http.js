/**
 * Copyright (c) 2017 5u9ar (zhuyingda)
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const request = require('request');

/**
 * @desc 封装过的基础http请求
 * @return Promise
 */
function http(option) {
    let interval = null;
    let retry = 0;
    let reqFinish = false;
    let inst = null;
    let timeout = 3000;
    return new Promise((resolve, reject) => {
        let cb = function (err, resp, httpBody) {
            if (!reqFinish) {
                if (err) {
                    console.error('base http method error and retry, error message:', err);
                    inst = request.get(option, cb);
                }
                else {
                    resolve(httpBody);
                    clearInterval(interval);
                }
            }
        };
        inst = request.get(option, cb);
        interval = setInterval(() => {
            console.log('retry time:', ++retry);
            inst.abort();
            inst = request.get(option, cb);
        }, timeout);
    });
}

module.exports = http;