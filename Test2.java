// Example: Test2.java
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

public class Test2 {
    public static void main(String[] args) {
        // Create an instance of Test2 and call test01
        Test2 test = new Test2();
        test.test01();
    }
    @Test
    public void test01() {
        OllamaLlmConfig config = new OllamaLlmConfig();
        config.setEndpoint("http://localhost:11434");
        config.setModel("llama3");
        config.setDebug(true);

        Llm llm = new OllamaLlm(config);
        String chat = llm.chat("who are you");
        System.out.println(chat);
    }
}
