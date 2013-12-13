<?php
    $root = 'http://62.210.239.25/DucksManager/remote/WhatTheDuck2.php?';

    if (isset($_GET['params'])) {

        $parametres = json_decode($_GET['params']);
        $parametres_url=array();
        foreach($parametres as $cle=>$valeur) {
            $parametres_url[] = $cle.'='.$valeur;
        }
        $parametres_url = implode('&',$parametres_url);

        $url = $root.$parametres_url;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        echo curl_exec($ch);
        curl_close($ch);
    }
    else {
    	echo 'Erreur : Aucun paramètre';
    }
?>