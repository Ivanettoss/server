#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include "cJSON.h"

 
#define EARTH_RADIUS 6371000.0
#define MPI 3.14159265358979323846
#define SERVER_ADDR "127.0.0.1"
#define SERVER_PORT 5000   

void send_coordinates(int sockFD, float LAT, float LON){

// create an empty json object
    cJSON *root = cJSON_CreateObject();

// add Lat and Lon matched with them values to root object (Lat : LAT , Lon: LON)
    cJSON_AddNumberToObject(root,"Lat",LAT);
    cJSON_AddNumberToObject(root,"Lon",LON);

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

int main(){

    int sockFD;
    struct sockaddr_in server_addr;

// create a tcp socket, ipv4(af inet) and define the stream type (sock stream), 0=tcp)
    sockFD=socket(AF_INET,SOCK_STREAM,0);

// creation failure will generate a negative socketFD
    if (sockFD<0){
        perror("An error occurred during socket creation");
        exit(1);
    }

// reset the server_addr struct
    memset(&server_addr, 0, sizeOf(server_addr));

// define the struct 
    server_addr.sin_family = AF_INET;   // ipv4 family addresses
    server_addr.sin_port=htons(SERVER_PORT); // converts serverport to a network format
    server_addr.sin_addr.s_addr=inet_addr(SERVER_ADDR); // convert IP in server addr in a usable format

//  check the connection 
    if (connect(sockFD,(struct sockaddr *)&server_addr, sizeof(server_addr)) < 0){
        perror("Connection failed");
        exit(1);
    }

    float starting_LAT = 42.020637;
    float starting_LON = 11.900794;

    while(1){

        float new_lat ;
        float new_lon ;
        generate_position(starting_LAT,starting_LON, &new_lat, &new_lon);

        send_coordinates(sockFD,new_lat,new_lon);;
    }

// close the socket
    close(sockFD);
}


