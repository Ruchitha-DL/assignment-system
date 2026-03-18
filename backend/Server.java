import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;

public class Server {

    static String filePath = "../data/assignments.json";

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(new InetSocketAddress(8080),0);

        // SUBMIT
        server.createContext("/submit", exchange -> {

            if(exchange.getRequestMethod().equals("POST")){

                String body = new String(exchange.getRequestBody().readAllBytes());

                String existing = Files.readString(Paths.get(filePath));

                String updated;

                if(existing.equals("[]")){
                    updated = "[" + body + "]";
                } else {
                    updated = existing.substring(0, existing.length()-1) + "," + body + "]";
                }

                Files.writeString(Paths.get(filePath), updated);

                String response = "Saved";
                exchange.sendResponseHeaders(200, response.length());
                exchange.getResponseBody().write(response.getBytes());
                exchange.close();
            }
        });

        // GET ALL
        server.createContext("/assignments", exchange -> {

            String data = Files.readString(Paths.get(filePath));

            exchange.sendResponseHeaders(200, data.length());
            exchange.getResponseBody().write(data.getBytes());
            exchange.close();
        });

        // GRADE UPDATE
        server.createContext("/grade", exchange -> {

            if(exchange.getRequestMethod().equals("POST")){

                String body = new String(exchange.getRequestBody().readAllBytes());

                // simple replacement logic
                String data = Files.readString(Paths.get(filePath));

                // NOTE: simple approach (works for demo)
                data = data.replaceFirst("\"grade\":\"Not graded\"", "\"grade\":\"" + body + "\"");
                data = data.replaceFirst("\"status\":\"Submitted\"", "\"status\":\"Graded\"");

                Files.writeString(Paths.get(filePath), data);

                String response = "Updated";
                exchange.sendResponseHeaders(200, response.length());
                exchange.getResponseBody().write(response.getBytes());
                exchange.close();
            }
        });

        server.start();
        System.out.println("Server running at http://localhost:8080");
    }
}