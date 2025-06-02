#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <math.h>
#include <arpa/inet.h>
#include "cJSON.h"
#include <time.h>
#include <curl/curl.h>  
 
#define EARTH_RADIUS 6371000.0
#define MPI 3.14159265358979323846
#define SERVER_ADDR "127.0.0.1"
#define SERVER_PORT 5000 


void send_test_packet(float ALT)
{
    long http_code = 0;

    // Crea oggetto JSON
    cJSON *root = cJSON_CreateObject();
    cJSON_AddStringToObject(root, "userid", "user6");
    cJSON_AddStringToObject(root, "boaid", "0x001");
    cJSON_AddStringToObject(root, "boakey", "VP_eoe8GL8rIYxtzy2h-cpdMV6xWebuC38NtHo_JalMxBLFxcR4-qPFLCX7Iqg9GYOXkPtNo5FcY83Yxogb3SQ==");
    cJSON_AddNumberToObject(root, "alt", ALT);

    char *json_data = cJSON_PrintUnformatted(root);

    CURL *curl = curl_easy_init();
    if (curl) {
        CURLcode res;

        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        const char *url = "http://25.4.162.138:8080/writeData";

        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

        // ✅ Forza l'uso dell'interfaccia di rete Hamachi
        curl_easy_setopt(curl, CURLOPT_INTERFACE, "ham0");

        printf("[DEBUG] Invio richiesta a: %s\n", url);
        printf("[DEBUG] Payload JSON: %s\n", json_data);

        res = curl_easy_perform(curl);

        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);

        if (res != CURLE_OK) {
            fprintf(stderr, "[ERRORE] Richiesta fallita: %s (codice %d)\n", curl_easy_strerror(res), res);
        } else {
            printf("[INFO] Richiesta HTTP inviata con successo\n");
        }

        printf("[INFO] HTTP response code: %ld\n", http_code);

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    } else {
        fprintf(stderr, "[ERRORE] Impossibile inizializzare CURL\n");
    }

    cJSON_Delete(root);
    free(json_data);
}

    





void send_coordinates(int sockFD,int BID, float LAT, float LON,float ALT ){

// create an empty json object
    cJSON *root = cJSON_CreateObject();

// add Id, Lat and Lon matched with them values to root object (BuoyID:BID,Lat : LAT , Lon: LON)
    cJSON_AddNumberToObject(root,"BuoyId",BID);
    cJSON_AddNumberToObject(root,"Lat",LAT);
    cJSON_AddNumberToObject(root,"Lon",LON);
    cJSON_AddNumberToObject(root,"Alt",ALT);

// conver the root object into an unformatted string
    char *json_str=cJSON_PrintUnformatted(root);

// send datas using TCP socket
    send(sockFD,json_str, strlen(json_str),0);

    free(json_str);
    cJSON_Delete(root);
}


void generate_position(float lat, float lon, float *new_lat, float *new_lon) {

    float distance = 500.0;

   
    float angolo = ((float)rand() / RAND_MAX) * 2.0f * MPI;

    // Calculate the shift
    float delta_lat = (distance / EARTH_RADIUS) * cos(angolo);
    float delta_lon = (distance / (EARTH_RADIUS * cos(lat * MPI / 180.0))) * sin(angolo);

    // rad to degre conversion
    *new_lat = lat + delta_lat * (180.0 / MPI);
    *new_lon = lon + delta_lon * (180.0 / MPI);
}




void generate_buoyid(int *new_BuoyId) {
    static int id_pool[10] = {
        201, 202, 103, 104, 105, 106, 107, 108,  
        201, 202                               
    };

    int index = rand() % 10; 
    *new_BuoyId = id_pool[index];
}


int main(){

   
        send_test_packet(42.0f);
        return 0;
    
    
}


