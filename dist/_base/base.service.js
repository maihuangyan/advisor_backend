"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const utils_1 = require("../utils/utils");
class BaseService {
    consoleLog(...args) {
        console.log(utils_1.getLine(), ...args);
    }
    consoleError(...args) {
        console.error(utils_1.getLine(), ...args);
    }
    setSchedulerRegistry(schedulerRegistry) {
        this.mSchedulerRegistry = schedulerRegistry;
    }
    clearTimeout(name) {
        try {
            const timeout = this.mSchedulerRegistry.getTimeout(name);
            this.mSchedulerRegistry.deleteTimeout(name);
            clearTimeout(timeout);
        }
        catch (e) {
            this.consoleError(e);
        }
    }
    addTimeout(name, milliseconds, callback) {
        this.clearTimeout(name);
        const timeout = setTimeout(callback, milliseconds);
        this.mSchedulerRegistry.addTimeout(name, timeout);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map