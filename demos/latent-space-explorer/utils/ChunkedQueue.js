/* Copyright 2017 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
export class Queue {
    constructor() {
        this.interval = 1000;
        this.elementsPerChunk = 1;
        this.timeoutID = -1;
        this.clear();
    }
    add(cb, id, priority) {
        this.remove(id);
        if (id == null) {
            id = -1;
        }
        if (priority == null) {
            priority = -1;
        }
        this.queue.push({ cb, id, priority });
        this.queue.sort((a, b) => a.priority - b.priority);
        this.kick();
    }
    clear() {
        clearTimeout(this.timeoutID);
        this.queue = [];
        this.running = false;
    }
    get length() {
        return this.queue.length;
    }
    remove(id) {
        this.queue = this.queue.filter(item => id !== item.id);
    }
    nextChunk() {
        return this.queue.splice(-this.elementsPerChunk);
    }
    kick() {
        if (!this.running) {
            this.running = true;
            this.timeoutID = window.setTimeout(() => this.run(), this.interval);
        }
    }
    run() {
        const chunk = this.nextChunk();
        chunk.forEach((item) => {
            item.cb();
        });
        this.running = false;
        if (this.queue.length) {
            this.kick();
        }
    }
}
