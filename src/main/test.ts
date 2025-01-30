import { run } from "worker-testbed";

import { CC_EXECUTE_TEST } from "src/config/params";

import "src/test/navigation_registry.test";
import "src/test/pharma_product_registry.test";

if (CC_EXECUTE_TEST) {
    run(import.meta.url, () => {
        console.log("All tests finished");
        setTimeout(() => process.exit(-1), 5_000);
    });
}
