FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/JewelryApi/JewelryApi.csproj", "backend/JewelryApi/"]
RUN dotnet restore "backend/JewelryApi/JewelryApi.csproj"
COPY . .
RUN dotnet build "backend/JewelryApi/JewelryApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend/JewelryApi/JewelryApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JewelryApi.dll"]
