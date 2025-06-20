#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <math.h>
#include <arpa/inet.h>
#include <time.h>
#include "cJSON.h"


#define EARTH_RADIUS 6371000.0
#define MPI 3.14159265358979323846
#define SERVER_ADDR "127.0.0.1"
#define SERVER_PORT 5000

// number of active buoy to simulate 
#define NUM_BOE 5  

// info to pass to the thrds
typedef struct {
    int buoy_index;
    int buoy_id;
    float start_lat;
    float start_lon;
} BuoyArgs;

void send_coordinates(int sockFD, int BID, float LAT, float LON) {
    cJSON *root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "BuoyId", BID);
    cJSON_AddNumberToObject(root, "Lat", LAT);
    cJSON_AddNumberToObject(root, "Lon", LON);
    char *json_str = cJSON_PrintUnformatted(root);
    send(sockFD, json_str, strlen(json_str), 0);
    free(json_str);
    cJSON_Delete(root);
}

void generate_position(float lat, float lon, float *new_lat, float *new_lon) {
    float distance = 500.0;
    float angolo = ((float)rand() / RAND_MAX) * 2.0f * MPI;
    float delta_lat = (distance / EARTH_RADIUS) * cos(angolo);
    float delta_lon = (distance / (EARTH_RADIUS * cos(lat * MPI / 180.0))) * sin(angolo);
    *new_lat = lat + delta_lat * (180.0 / MPI);
    *new_lon = lon + delta_lon * (180.0 / MPI);
}

void *simulate_buoy(void *arg) {

    BuoyArgs *buoyArgs = (BuoyArgs *)arg;
    int buoy_id = buoyArgs->buoy_id;

    int sockFD;
    struct sockaddr_in server_addr;

    sockFD = socket(AF_INET, SOCK_STREAM, 0);
    if (sockFD < 0) {
        perror("Socket creation failed");
        pthread_exit(NULL);
    }

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(SERVER_PORT);
    server_addr.sin_addr.s_addr = inet_addr(SERVER_ADDR);

    if (connect(sockFD, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Connection failed");
        close(sockFD);
        pthread_exit(NULL);
    }

    float starting_LAT = buoyArgs->start_lat;
    float starting_LON = buoyArgs->start_lon;

    while (1) {
        float new_lat, new_lon;
        generate_position(starting_LAT, starting_LON, &new_lat, &new_lon);
        send_coordinates(sockFD, buoy_id, new_lat, new_lon);
        sleep(1 + rand() % 3);
    }

    close(sockFD);
    pthread_exit(NULL);
}

int main() {

    srand(time(NULL));

    // create an array of pthread_t to match threads and buoys
    pthread_t threads[NUM_BOE];


    BuoyArgs args[NUM_BOE];

    int buoy_ids[NUM_BOE] = {201, 202, 203, 204, 205};
    float base_lat = 42.020637;
    float base_lon = 11.900794;

    for (int i = 0; i < NUM_BOE; i++) {
        args[i].buoy_index = i;
        args[i].buoy_id = buoy_ids[i];
        args[i].start_lat = base_lat + i * 0.002;
        args[i].start_lon = base_lon + i * 0.002;
        if (pthread_create(&threads[i], NULL, simulate_buoy, &args[i]) != 0) {
            perror("Errore nella creazione del thread");
        }
    }

    for (int i = 0; i < NUM_BOE; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}
